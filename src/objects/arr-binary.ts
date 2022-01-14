import { isBang } from "../sdk";
import Op from "./base";
import type { IInletsMeta, IOutletsMeta, IArgsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class Binary extends Op<[any, any], [any], [any]> {
    static description = "Binary Operation for Array";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "First array"
    }, {
        isHot: false,
        type: "anything",
        description: "Second element or array"
    }];
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: "Result"
    }];
    static args: IArgsMeta = [{
        type: "anything",
        optional: true,
        default: 0,
        description: "Initial second element or array"
    }];
    execute: (a: any, b: any) => any;
    _ = { arg: this.args[0], result: undefined as any };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            this._.arg = undefined;
            this._.result = undefined;
            if (!args || args.length === 0) return;
            this._.arg = args[0];
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    try {
                        this._.result = this.execute(data, this._.arg);
                    } catch (e) {
                        this.error(e);
                        return;
                    }
                }
                this.outlet(0, this._.result);
            } else if (inlet === 1) {
                this._.arg = data;
            }
        });
    }
}
