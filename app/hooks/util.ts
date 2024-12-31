export const changeUnix = (unixTimestamp: any) => {
    const unixTimestampLE = parseInt(unixTimestamp, 16);
    const milliseconds = unixTimestampLE * 1000;
    const dateObject = new Date(milliseconds);
    const formattedDate = `${dateObject.getFullYear()}-${dateObject.getMonth() + 1}-${dateObject.getDate()}`;
    const formattedTime = `${dateObject.getHours()}:${dateObject.getMinutes()}:${dateObject.getSeconds()}`;

    return `${formattedDate} ${formattedTime}`;
};
