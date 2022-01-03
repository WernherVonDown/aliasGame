import { useState } from "react";

export default function useInput(initialValue: string) {
    const [value, setValue] = useState(initialValue);

    const onChange = (e: React.ChangeEvent<HTMLInputElement> | any): void => {
        setValue(e.target.value)
    }

    const clear = () => setValue('')

    return {
        value,
        onChange,
        clear
    }
}