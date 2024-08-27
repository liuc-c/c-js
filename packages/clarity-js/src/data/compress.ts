import { Constant } from "@clarity-types/data";
import config from "@src/core/config";

const supported = Constant.CompressionStream in window;
// const TEStream = 'TextEncoderStream' in window;

export default async function(input: string): Promise<Uint8Array> {
    try {

        let stream:ReadableStream = null;
        if(supported && config.isGzip){
            stream = new ReadableStream({async start(controller) {
                controller.enqueue(input);
                controller.close();
            }}).pipeThrough(new TextEncoderStream()).pipeThrough(new window[Constant.CompressionStream]("gzip"))
        }else{
            return null;
        }

        return new Uint8Array(await read(stream));

        // let stream:ReadableStream = null;
        // if(supported && config.isGzip){
        //     stream = new ReadableStream({async start(controller) {
        //         controller.enqueue(input);
        //         controller.close();
        //     }}).pipeThrough(new TextEncoderStream()).pipeThrough(new window[Constant.CompressionStream]("gzip"))
        // }else if(TEStream){
        //     stream = new ReadableStream({async start(controller) {
        //         controller.enqueue(input);
        //         controller.close();
        //     }}).pipeThrough(new TextEncoderStream());
        // }else{
        //     return null;
        // }

        // return new Uint8Array(await read(stream));
    
    } catch (e){
    /* do nothing */ }
    return null;
}

async function read(stream: ReadableStream): Promise<number[]> {
    const reader = stream.getReader();
    const chunks:number[] = [];
    let done = false;
    let value: number[] = [];
    while (!done) {
      ({ done, value } = await reader.read());
      if (done) { return chunks; }
      chunks.push(...value);
    }
    return chunks;
}
