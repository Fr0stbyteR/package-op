import { isBang } from "../sdk";
import Op from "./base";
import type { IInletsMeta, IOutletsMeta, IArgsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class Ternary extends Op<[any, any, any], [any], [any, any]> {
    static description = "Ternary Operation for array";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "Test array"
    }, {
        isHot: false,
        type: "anything",
        description: "True output array"
    }, {
        isHot: false,
        type: "anything",
        description: "False output array"
    }];
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: "Result"
    }];
    static args: IArgsMeta = [{
        type: "anything",
        optional: true,
        default: true,
        description: "Initial true output"
    }, {
        type: "anything",
        optional: true,
        default: false,
        description: "Initial false output"
    }];
    _ = { args: [this.args.length ? this.args[0] : true, this.args.length > 1 ? this.args[1] : false], result: undefined as any };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            this._.args = [args.length ? args[0] : true, args.length > 1 ? args[1] : false];
            this._.result = undefined;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    try {
                        if (Array.isArray(data)) {
                            const result = [];
                            const trueArray = this._.args[0];
                            const falseArray = this._.args[1];
                            const length = Math.min(data.length, Array.isArray(trueArray) ? trueArray.length : data.length, Array.isArray(falseArray) ? falseArray.length : data.length);
                            for (let i = 0; i < length; i++) {
                                result[i] = data[i] ? (Array.isArray(trueArray) ? trueArray[i] : trueArray) : (Array.isArray(falseArray) ? falseArray[i] : falseArray);
                            }
                            this._.result = result;
                        } else {
                            this._.result = data ? this._.args[0] : this._.args[1];
                        }
                    } catch (e) {
                        this.error(e);
                        return;
                    }
                }
                this.outlet(0, this._.result);
            } else if (inlet === 1) {
                this._.args[0] = data;
            } else if (inlet === 2) {
                this._.args[1] = data;
            }
        });
    }
}
