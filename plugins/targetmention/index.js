(() => {
    const { patcher, metro } = vendetta;

    const MessageActions = metro.findByProps("sendMessage");

    if (!MessageActions?.sendMessage) return;

    let targetUserIds = [];

    patcher.before("sendMessage", MessageActions, (args) => {
        const message = args?.[1];

        if (!message?.content) return;

        const content = message.content;

        // Lấy tất cả mention trong tin nhắn
        const mentions = [...content.matchAll(/<@!?(\d+)>/g)];

        // Nếu có mention → cập nhật danh sách target
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

            // 60% có =)), 40% không có
            const suffix = Math.random() < 0.6 ? " =))" : "";

            message.content =
                "> # " + cleanContent + " " + targets + suffix;

            return;
        }

        // Các tin nhắn sau tự động dùng target đã lưu
        if (targetUserIds.length > 0) {
            const targets = targetUserIds
                .map(id => "<@" + id + ">")
                .join(" ");

            const suffix = Math.random() < 0.6 ? " =))" : "";

            message.content =
                "> # " + content + " " + targets + suffix;
        } else {
            // Chưa có target
            const suffix = Math.random() < 0.6 ? " =))" : "";

            message.content =
               
