
import _Unary from "./objects/unary";
import _Binary from "./objects/binary";
import _Ternary from "./objects/ternary";
import functions from "./objects/functions";
import functionsNames from "./objects/function-names"
import { BaseObject, generateRemotedObject } from "./sdk";

const Unary = generateRemotedObject(_Unary as typeof BaseObject);
const Binary = generateRemotedObject(_Binary as typeof BaseObject);
const Ternary = generateRemotedObject(_Ternary as typeof BaseObject);

const Ops: Record<string, typeof Unary | typeof Binary | typeof Ternary> = { "?": Ternary };
for (const key in functions) {
    const f = functions[key];
    if (f.length === 1) {
        Ops[key] = class extends Unary {
            static get _name() { return functionsNames[key]; }
            execute = f;
        };
    } else if (f.length === 2) {
        Ops[key] = class extends Binary {
            static get _name() { return functionsNames[key]; }
            execute = f;
        };
    }
}

export default async () => {
    return Ops;
};