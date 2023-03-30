import { showNotification } from "@mantine/notifications";
import { createQuery } from "./utils";

const Platforms = [
    {
        name: "lighttube",
        instances: "https://raw.githubusercontent.com/kuylar/lighttube/master/public_instances.json",
        parse: (instances) => {
            return instances.map((i) => {
                let features = [];

                if(i.api) features.push("LT_API");
                if(i.accounts) features.push("LT_ACCOUNTS");

                return {
                    name: i.host.replace("https://", ""),
                    host: i.host,
                    features,
                    extra: {},
                };
            });
        },
        getInfo: async () => {
            
        },
    },
    {
        name: "poketube",
        instances: "https://poketube.fun/api/instances.json",
        parse: (instances) => {
            return instances.map((i) => {
                let features = [];

                if(i.CLOUDFLARE) features.push("PT_CF");
                if(i.proxy) features.push("PT_PROXY");

                return {
                    name: i[0],
                    host: i[1].uri,
                    features,
                    extra: i[1].software,
                };
            });
        },
        getInfo: async () => {

        },
    }
];

class APIController {
    constructor() {
        this.instance = {
            type: "lighttube",
            name: "lighttube-nightly",
            host: "https://lighttube-nightly.kuylar.dev",
            features: ["LT_V2", "LT_API", "LT_ACCOUNTS", "LT_PROXY"],
            extra: {},
        };

        try {
            if(localStorage.getItem("instance")) {
                this.instance = JSON.parse(localStorage.getItem("instance"));
            };
        } catch(e) {}
    }

    // -- instances --

    async getAllInstances() {
        let final = [/* {
            type: "yt",
            list: [
                {
                    name: "YouTube",
                    host: "https://youtube.com",
                },
            ],
        } */];

        for(let platform of Platforms) {
            try {
                let json = await (await fetch(platform.instances)).json();
                let list = platform.parse(json) || [];
                final.push({
                    type: platform.name,
                    list,
                });
            } catch(e) {
                showNotification({
                    title: "Error while parsing instances",
                    message: "Check console for more info",
                    color: "red",
                });
                console.log(e);
            }
        };

        return final;
    }

    async getAlternatives() {
        if(this.alternatives) return this.alternatives;
        this.alternatives = await this.getAllInstances();
        return this.alternatives;
    };

    setInstance(i) {
        // TODO validation so it doesnt broke
        this.instance = i;
    }

    async getInstanceInfo(instance) {
        let platform = Platforms.find(p => p.name == instance.type);
        try {
            return await platform.getInfo(instance);
        } catch(e) {
            showNotification({
                title: "Error while getting instance info",
                message: "Check console for more info",
                color: "red",
            });
            console.log(e);
        }
    }

    // -- request --

    async request(path, { query = {}, signal }) {
        path = path.startsWith("/") ? path.slice(1) : path;
        let url = new URL(this.instance.host + (this.instance.host.endsWith("/") ? "" : "/") + "api/" + path);
        for(let [k,v] of Object.entries(query))
            url.searchParams.set(k, v);
        
        
        let res = await fetch(url, {
            signal,
            headers: {
                "Content-Type": "application/json; utf-8",
            },
        });

        let json = await res.json();
        if(this.instance.features?.includes("LT_V2")) {
            if(json.error) {
                console.error("[API ERROR]");
                console.log("Instance:", this.instance);
                console.log("Error:", json.error);
                console.log("URL:", url);
                return;
            };

            return json.data;
        } else {
            return json;
        }
    }

    // -- api --

    async searchSuggestions(q, signal) {
        if(!q) return [];
        let { autocomplete } = await this.request("/searchSuggestions", { query: { query: q }, signal });
        return autocomplete;
    }

    async search(q) {
        return await this.request("/search", { query: q });
    }

    async video(v, ex) {
        return await this.request("/video", { query: { id: v, v, ...ex } });
    }

    async player(v, ex) {
        return await this.request("/player", { query: { id: v, v, ...ex } });
    }

    async comments(continuation) {
        return await this.request("/comments", { query: { continuation } });
    }

    canUseProxy() {
        return this.instance.features?.includes("LT_PROXY");
    }

    getProxyURL(v, f) {
        return new URL(this.instance.host + (this.instance.host.endsWith("/") ? "" : "/") + "proxy/media/" + v + "/" + f);
    }

    async getDislikes(v) {
        return (await (await fetch("https://returnyoutubedislikeapi.com/votes?" + createQuery({
            videoId: v,
        }))).json()).dislikes;
    }
};

export default new APIController();