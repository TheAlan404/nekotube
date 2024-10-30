// reference: https://github.com/stasilo/BeatDetector/blob/master/beatdetector.js

export type BassDetector = ReturnType<typeof createBassDetector>;

export const createBassDetector = (analyser: AnalyserNode) => {
    const MAX_COLLECT_SIZE = 43 * (analyser.fftSize / 2);
    const COLLECT_SIZE = 1;
    const sens = 0.05;
    const bufferLength = analyser.frequencyBinCount;

    let historyBuffer = [];
    let instantEnergy = 0;
    let prevTime = 0;
    let bpmTable = [];

    const isOnBeat = () => {
        let localAverageEnergy = 0;
        let instantCounter = 0;
        let isBeat = false;

        let bpmArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(bpmArray);

        // fill history buffer 
        for (var i = 0; i < bpmArray.length - 1; i++, ++instantCounter) {
            historyBuffer.push(bpmArray[i]);  //add sample to historyBuffer
            instantEnergy += bpmArray[i];
        }

        //done collecting MAX_COLLECT_SIZE history samples 
        //have COLLECT_SIZE nr of samples as instant energy value
        if (instantCounter > COLLECT_SIZE - 1 &&
            historyBuffer.length > MAX_COLLECT_SIZE - 1) {
            instantEnergy = instantEnergy / (COLLECT_SIZE * (analyser.fftSize / 2));

            var average = 0;
            for (var i = 0; i < historyBuffer.length - 1; i++) {
                average += historyBuffer[i];
            }

            localAverageEnergy = average / historyBuffer.length;

            var timeDiff = analyser.context.currentTime - prevTime;

            // timeDiff > 2 is out of normal song bpm range, but if it is a multiple of range [0.3, 1.5] 
            // we probably have missed a beat before but now have a match in the bpm table.
            if (timeDiff > 2 && bpmTable.length > 0) {
                //check if we have a multiple of range in bpm table
                for (var j = 0; j < bpmTable.length - 1; j++) {
                    // mutiply by 10 to avoid float rounding errors
                    var timeDiffInteger = Math.round((timeDiff / bpmTable[j]['time']) * 1000);

                    // timeDiffInteger should now be a multiple of a number in range [3, 15] 
                    // if we have a match

                    if (timeDiffInteger % (Math.round(bpmTable[j]['time']) * 1000) == 0) {
                        timeDiff = Number(bpmTable[j]['time']);
                    }
                }
            }


            //still?
            if (timeDiff > 3) {
                prevTime = timeDiff = 0;
            }

            // MAIN BPM HIT CHECK //

            // CHECK IF WE HAVE A BEAT BETWEEN 200 AND 40 BPM (every 0.29 to 2s), or else ignore it.
            // Also check if we have _any_ found prev beats
            if (analyser.context.currentTime > 0.29 && instantEnergy > localAverageEnergy &&
                (instantEnergy > (sens * localAverageEnergy)) &&
                ((timeDiff < 2.0 && timeDiff > 0.29) || prevTime == 0)) {

                isBeat = true;

                prevTime = analyser.context.currentTime;

                let bpm: any = {
                    time: Number(timeDiff.toFixed(3)),
                    counter: 1,
                };


                for (var j = 0; j < bpmTable.length; j++) {
                    //FOUND ANOTHER MATCH FOR ALREADY GUESSED BEAT

                    if (bpmTable[j]['time'] == bpm['time']) {
                        bpmTable[j]['counter']++;
                        bpm = 0;

                        if (bpmTable[j]['counter'] > 3 && j < 2) {
                            console.log("WE HAVE A BEAT MATCH IN TABLE!!!!!!!!!!");
                        }

                        break;
                    }
                }

                if (bpm || bpmTable.length == 0) {
                    bpmTable.push(bpm);
                }

                //sort and draw 10 most current bpm-guesses
                bpmTable.sort((a, b) =>
                    b.counter - a.counter
                );
            }

            var temp = historyBuffer.slice(0); //get copy of buffer

            historyBuffer = []; //clear buffer

            // make room in array by deleting the last COLLECT_SIZE samples.
            historyBuffer = temp.slice(COLLECT_SIZE * (analyser.fftSize / 2), temp.length);

            instantCounter = 0;
            instantEnergy = 0;

            localAverageEnergy = 0;

            return isBeat;
        }
    };

    const getBPMGuess = () => {
        let allGuesses = 0;
        let guesses = 0;
        let counter = 0;

        if (bpmTable.length <= 2) {
            return null;
        }

        for (var i = 0; i < bpmTable.length; i++) {
            allGuesses += Number(bpmTable[i].time);

            if (bpmTable[i]['counter'] > 1) {
                guesses += Number(bpmTable[i].time);

                counter++;
            }
        }

        return {
            conservative: Math.round(60 / (guesses / counter)),
            all: Math.round(60 / (allGuesses / bpmTable.length))
        };
    }

    return {
        isOnBeat,
        getBPMGuess,
    };
};
