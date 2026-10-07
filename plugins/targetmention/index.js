(() => {
    const { patcher, metro } = vendetta;

    const MessageActions = metro.findByProps("sendMessage");

    if (!MessageActions?.sendMessage) return;

    let targetUserId = null;

    patcher.before("sendMessage", MessageActions, (args) => {
        const message = args?.[1];

        if (!message?.content) return;

        const content = message.content;

        const mention = content.match(/<@!?(\d+)>/);

        if (mention) {
            targetUserId = mention[1];
            return;
        }

        if (targetUserId) {
            message.content =
                "> # <@" + targetUserId + "> " + content + " 😂";
        } else {
            message.content = "> # " + content + " 😂";
        }
    });
})();
