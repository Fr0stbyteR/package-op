import _Unary from "./objects/unary";
import _Binary from "./objects/binary";
import _Ternary from "./objects/ternary";
import _ArrUnary from "./objects/arr-unary";
import _ArrBinary from "./objects/arr-binary";
import _ArrTernary from "./objects/arr-ternary";
import functions from "./objects/functions";
import functionsNames from "./objects/function-names"
import { BaseObject, generateDefaultObject } from "./sdk";

const Unary = generateDefaultObject(_Unary as typeof BaseObject);
const Binary = generateDefaultObject(_Binary as typeof BaseObject);
const Ternary = generateDefaultObject(_Ternary as typeof BaseObject);
const ArrUnary = generateDefaultObject(_ArrUnary as typeof BaseObject);
const ArrBinary = generateDefaultObject(_ArrBinary as typeof BaseObject);
const ArrTernary = generateDefaultObject(_ArrTernary as typeof BaseObject);


const Ops: Record<string, typeof Unary | typeof Binary | typeof Ternary> = { "?": Ternary, "[]?": ArrTernary };
for (const key in functions) {
    const f = functions[key];
    if (f.length === 1) {
        Ops[key] = class extends Unary {
            static get _name() { return functionsNames[key]; }
            execute = f;
        };
        Ops[`[]${key}`] = class extends ArrUnary {
            static get _name() { return functionsNames[key]; }
            execute = (a: any) => {
                if (Array.isArray(a)) return a.map(f);
                else return f(a)
            }
        }
    } else if (f.length === 2) {
        Ops[key] = class extends Binary {
            static get _name() { return functionsNames[key]; }
            execute = f;
        };
        Ops[`[]${key}`] = class extends ArrBinary {
            static get _name() { return functionsNames[key]; }
            execute = (a: any, b: any) => {
                if (Array.isArray(a)) {
                    if (Array.isArray(b)) {
                        const result = [];
                        const length = Math.min(a.length, b.length);
                        for (let i = 0; i < length; i++) {
                            result[i] = f(a[i], b[i]);
                        }
                        return result;
                    } else {
                        return a.map(v => f(v, b));
                    }
                } else {
                    return f(a, b);
                }
            }
        }
    }
}

export default async () => {
    return Ops;
};