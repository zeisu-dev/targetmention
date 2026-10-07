(() => {
    const { patcher, metro } = vendetta;

    const MessageActions = metro.findByProps("sendMessage");

    if (!MessageActions?.sendMessage) return;

    let targetUserIds = [];

    patcher.before("sendMessage", MessageActions, (args) => {
        const message = args?.[1];

        if (!message?.content) return;

        const content = message.content;

        const mentions = [...content.matchAll(/<@!?(\d+)>/g)];

        if (mentions.length > 0) {
            targetUserIds = [...new Set(mentions.map(m => m[1]))];
            return;
        }

        if (targetUserIds.length > 0) {
            const targets = targetUserIds
                .map(id => "<@" + id + ">")
                .join(" ");

            message.content =
                "> # " + targets + " " + content;
        } else {
            message.content =
                "> # " + content;
        }
    });
})();
