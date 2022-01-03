export const cookieToObject = (cookie: string): any => {
    const cookieProps = cookie.split('; ');
    return cookieProps.reduce((accum: any, prop) => {
        const propNameValue = prop.split('=');
        const propName = propNameValue[0];
        const propValue = propNameValue[propNameValue.length - 1];
        return { ...accum, [propName]: propValue }
    }, {})
};