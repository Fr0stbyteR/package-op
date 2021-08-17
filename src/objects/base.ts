import { author, name, version, description } from "../index";
import { BaseObject } from "../sdk";

export default class Op<I extends any[] = any[], O extends any[] = [any], A extends any[] = any[], P = {}> extends BaseObject<{}, {}, I, O, A, P> {
    static package = name;
    static author = author;
    static version = version;
    static description = description;
}
