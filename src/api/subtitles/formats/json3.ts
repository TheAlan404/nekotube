export interface JSON3Root {
    wireMagic: "pb3";
    pens: JSON3Pen[];
    wsWinStyles: JSON3WindowStyle[];
    wpWinPositions: JSON3WindowPosition[];
    events: JSON3Event[];
}

export interface JSON3Pen {
    iAttr: number;
    bAttr: number;
    szPenSize: number;
    etEdgeType: number;
    fsFontStyle: number;
    fcForeColor: number;
    foForeAlpha: number;
    boBackAlpha: number;
    ecEdgeColor: number;
}

export interface JSON3WindowStyle {
    juJustifCode: number;
    pdPrintDir: number;
    sdScrollDir: number;
}

export interface JSON3WindowPosition {
    apPoint: number;
    ahHorPos: number;
    avVerPos: number;
}

export interface JSON3Event {
    tStartMs: number;
    dDurationMs: number;
    wpWinPosId: number;
    wsWinStyleId: number;
    segs: JSON3Segment[];
}

export interface JSON3Segment {
    utf8: string;
    pPenId?: number;
}
