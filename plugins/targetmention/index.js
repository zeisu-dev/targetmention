(() => {
    const { patcher, metro } = vendetta;

    const MessageActions = metro.findByProps("sendMessage");

    if (!MessageActions?.sendMessage) return;

    let targetUserId = null;

    patcher.before("sendMessage", MessageActions, (args) => {
        const message = args?.[1];

        if (!message?.content) return;

        const content = message.content;

        // Có mention → lưu người đó làm target
        const mention = content.match(/<@!?(\d+)>/);

        if (mention) {
            targetUserId = mention[1];
            return;
        }

        // Các tin nhắn sau → tự động mention target
        if (targetUserId) {
            message.content =
                "# <@" + targetUserId + "> " + content;
        }
    });
})();
