(() => {
    const { patcher, metro } = vendetta;

    const MessageActions = metro.findByProps("sendMessage");

    if (!MessageActions?.sendMessage) return;

    let targetUserIds = [];

    patcher.before("sendMessage", MessageActions, (args) => {
        const message = args?.[1];

        if (!message?.content) return;

        const content = message.content;

        // Tìm tất cả mention trong tin nhắn
        const mentions = [...content.matchAll(/<@!?(\d+)>/g)];

        // Nếu có mention → cập nhật target
        if (mentions.length > 0) {
            targetUserIds = [...new Set(mentions.map(m => m[1]))];

            // Xóa mention khỏi nội dung gốc
            const cleanContent = content
                .replace(/<@!?\d+>/g, "")
                .replace(/\s+/g, " ")
                .trim();

            const targets = targetUserIds
                .map(id => "<@" + id + ">")
                .join(" ");

            message.content =
                "> # " + cleanContent + " " + targets + getRandomSuffix();

            return;
        }

        // Những tin nhắn sau tự động mention target đã lưu
        if (targetUserIds.length > 0) {
            const targets = targetUserIds
                .map(id => "<@" + id + ">")
                .join(" ");

            message.content =
                "> # " + content + " " + targets + getRandomSuffix();
        } else {
            message.content =
                "> # " + content + getRandomSuffix();
        }
    });

    function getRandomSuffix() {
        const random = Math.random();

        if (random < 0.2) {
            return " =))";
        } else if (random < 0.4) {
            return " 🤣";
        } else if (random < 0.6) {
            return " 😭";
        } else if (random < 0.8) {
            return " 😁";
        } else {
            return "";
        }
    }
})();
