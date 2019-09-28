interface IInput { value: any; type: string }

export default function encode(input: IInput | IInput[]): string;
