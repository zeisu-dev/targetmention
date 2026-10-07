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

        // Có mention → lưu target và bỏ mention khỏi nội dung
        if (mentions.length > 0) {
            targetUserIds = [...new Set(mentions.map(m => m[1]))];

            const cleanContent = content
                .replace(/<@!?\d+>/g, "")
                .replace(/\s+/g, " ")
                .trim();

            if (targetUserIds.length > 0) {
                const targets = targetUserIds
                    .map(id => "<@" + id + ">")
                    .join(" ");

                message.content =
                    "> # " + cleanContent + " " + targets;
            }

            return;
        }

        // Những tin nhắn sau
        if (targetUserIds.length > 0) {
            const targets = targetUserIds
                .map(id => "<@" + id + ">")
                .join(" ");

            message.content =
                "> # " + content + " " + targets;
        } else {
            message.content = "> # " + content;
        }
    });
})();
