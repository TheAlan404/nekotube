import { Text, Tooltip } from "@mantine/core";

const automaticRelativeDifference = (d: Date) => {
	const diff = -((new Date().getTime() - d.getTime())/1000)|0;
	const absDiff = Math.abs(diff);
	if (absDiff > 86400*30*10) {
		return { duration: Math.round(diff/(86400*365)), unit: 'years' };
	}
	if (absDiff > 86400*25) {
		return { duration: Math.round(diff/(86400*30)), unit: 'months' };
	}
	if (absDiff > 3600*21) {
		return { duration: Math.round(diff/86400), unit: 'days' };
	}
	if (absDiff > 60*44) {
		return { duration: Math.round(diff/3600), unit: 'hours' };
	}
	if (absDiff > 30) {
		return { duration: Math.round(diff/60), unit: 'minutes' };
	}
	return { duration: diff, unit: 'seconds' };
}

export const DateCard = ({
    date,
}: {
    date: Date,
}) => {
    let fmt = new Intl.RelativeTimeFormat("en", {
        style: 'long',
        numeric: 'auto',
    });
    let { duration, unit } = automaticRelativeDifference(date);
    let text = fmt.format(duration, unit as any);

    return (
        <Tooltip label={date.toString()}>
            <Text c="dimmed">
                {text}
            </Text>
        </Tooltip>
    );
}
