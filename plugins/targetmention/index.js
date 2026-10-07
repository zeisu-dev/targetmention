(() => {
    const { patcher, metro } = vendetta;

    const MessageActions = metro.findByProps("sendMessage");

    if (!MessageActions?.sendMessage) return;

    let targetUserIds = [];

    patcher.before("sendMessage", MessageActions, (args) => {
        const message = args?.[1];

        if (!message?.content) return;

        const content = message.content;

        // Không xử lý lại message đã được plugin xử lý
        if (message.__targetMentionProcessed) return;

        const mentions = [...content.matchAll(/<@!?(\d+)>/g)];

        if (mentions.length > 0) {
            targetUserIds = [...new Set(mentions.map(m => m[1]))];

            const cleanContent = content
                .replace(/<@!?\d+>/g, "")
                .replace(/\s+/g, " ")
                .trim();

            const targets = targetUserIds
                .map(id => "<@" + id + ">")
                .join(" ");

            const suffix = Math.random() < 0.6 ? " =))" : "";

            message.content =
                "> # " + cleanContent + " " + targets + suffix;

            message.__targetMentionProcessed = true;
            return;
        }

        if (targetUserIds.length > 0) {
            const targets = targetUserIds
                .map(id => "<@" + id + ">")
                .join(" ");

            const suffix = Math.random() < 0.6 ? " =))" : "";

            message.content =
                "> # " + content + " " + targets + suffix;

            message.__targetMentionProcessed = true;
            return;
        }

        const suffix = Math.random() < 0.6 ? " =))" : "";

        message.content =
            "> # " + content + suffix;

        message.__targetMentionProcessed = true;
    });
})();
