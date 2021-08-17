import { isBang } from "../sdk";
import Op from "./base";
import type { IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class Unary extends Op<[any]> {
    static description = "Unary Operation";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "First element"
    }];
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: "Result"
    }];
    execute: (a: any) => any;
    _ = { result: undefined as any };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("updateArgs", () => this._.result = undefined);
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    try {
                        this._.result = this.execute(data);
                    } catch (e) {
                        this.error(e);
                        return;
                    }
                }
                this.outlet(0, this._.result);
            }
        });
    }
}
