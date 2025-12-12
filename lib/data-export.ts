import * as XLSX from 'xlsx';

export interface ExportOptions {
    participantFields: {
        name: boolean;
        email: boolean;
        status: boolean;
        domain: boolean;
        date: boolean;
    };
    teamFields: {
        name: boolean;
        code: boolean;
    };
    customQuestions: string[]; // List of selected question keys
    includeDomainPriorities: boolean;
    checkpointFields: {
        weeks: number[]; // List of selected week numbers
        content: boolean;
        feedback: boolean;
        approvalStatus: boolean;
    };
}

export const exportRegistrationsToExcel = (data: any[], fileName: string, options: ExportOptions) => {
    // specific formatting for registration data
    const rows = data.map(reg => {
        // Flatten the object
        const row: any = {};

        // Participant Details
        if (options.participantFields.name) row['Participant Name'] = reg.user?.name;
        if (options.participantFields.email) row['Email'] = reg.user?.email;
        if (options.participantFields.status) row['Status'] = reg.status;
        if (options.participantFields.domain) row['Assigned Domain'] = reg.assignedDomain || 'N/A';
        if (options.participantFields.date) row['Registration Date'] = reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : 'N/A';

        // Team Details
        if (options.teamFields.name) row['Team Name'] = reg.team?.name || 'N/A';
        if (options.teamFields.code) row['Team Code'] = reg.team?.joinCode || 'N/A';

        // Custom Answers - Filter by selected questions
        if (reg.customAnswers) {
            Object.entries(reg.customAnswers).forEach(([key, value]) => {
                if (options.customQuestions.includes(key)) {
                    row[`Answer: ${key}`] = value;
                }
            });
        }

        // Domain Priorities
        if (options.includeDomainPriorities && Array.isArray(reg.domainPriorities)) {
            reg.domainPriorities.forEach((p: string, idx: number) => {
                row[`Priority ${idx + 1}`] = p;
            });
        }

        // Checkpoints (Submissions) - Filter by selected weeks
        if (Array.isArray(reg.checkpoints)) {
            // Sort by week number
            const checkpoints = [...reg.checkpoints].sort((a, b) => a.weekNumber - b.weekNumber);

            checkpoints.forEach((cp: any) => {
                if (options.checkpointFields.weeks.includes(cp.weekNumber)) {
                    if (options.checkpointFields.content) {
                        row[`Week ${cp.weekNumber} Submission`] = cp.submissionContent || 'No Content';
                    }
                    if (options.checkpointFields.feedback) {
                        row[`Week ${cp.weekNumber} Feedback`] = cp.mentorFeedback || 'N/A';
                    }
                    if (options.checkpointFields.approvalStatus) {
                        row[`Week ${cp.weekNumber} Approved`] = cp.isApproved ? 'Yes' : (cp.isApproved === false ? 'No' : 'Pending');
                    }
                }
            });
        }

        return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    // Auto-width columns
    const max_width = rows.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
    worksheet["!cols"] = Array(20).fill({ wch: 20 });

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
