(() => {
    const { patcher, metro } = vendetta;

    const MessageActions = metro.findByProps("sendMessage");

    if (!MessageActions?.sendMessage) return;

    let targetUserId = null;

    patcher.before("sendMessage", MessageActions, (args) => {
        const message = args?.[1];

        if (!message?.content) return;

        const content = message.content;

        // Nếu tin nhắn có mention → lưu người được mention làm target
        const mention = content.match(/<@!?(\d+)>/);

        if (mention) {
            targetUserId = mention[1];
            return;
        }

        // Những lần sau tự thêm target đã lưu
        if (targetUserId) {
            message.content =
                "# <@" + targetUserId + "> " + content;
        }
    });
})();
