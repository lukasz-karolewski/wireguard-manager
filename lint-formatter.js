const formatter = (results) => {
    const groupedByRule = {};
    let totalErrors = 0;
    let totalWarnings = 0;

    // Flatten all messages and group by ruleId
    for (const file of results) {
        for (const msg of file.messages) {

            const severity = msg.severity === 2 ? "error" : "warning";
            if (severity === "error") totalErrors++;
            else totalWarnings++;

            const { ruleId } = msg;
            if (!groupedByRule[ruleId]) {
                groupedByRule[ruleId] = [];
            }
            groupedByRule[ruleId].push({
                column: msg.column,
                filePath: file.filePath,
                line: msg.line,
                message: msg.message,
                severity: msg.severity === 2 ? "error" : "warning",
            });
        }
    }

    // Format the output
    const formattedOutput = Object.entries(groupedByRule)
        .map(([ruleId, messages]) => {
            const header = `\nRule: ${ruleId || "Unknown"} (${messages.length} issues)`;
            const details = messages
                .map(
                    (msg) =>
                        `${msg.filePath}:${msg.line}:${msg.column} - ${msg.severity}: ${msg.message}`
                )
                .join("\n");
            return `${header}\n${details}`;
        })
        .join("\n");

    if (!formattedOutput) {
        return "No issues found.";
    }
    return `${formattedOutput}\n\nSummary: ${totalErrors} errors, ${totalWarnings} warnings.`;
};

export default formatter;