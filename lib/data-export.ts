import * as XLSX from 'xlsx';

export const exportRegistrationsToExcel = (data: any[], fileName: string) => {
    // specific formatting for registration data
    const rows = data.map(reg => {
        // Flatten the object
        const row: any = {
            'Participant Name': reg.user?.name,
            'Email': reg.user?.email,
            'Team Name': reg.team?.name || 'N/A',
            'Team Code': reg.team?.joinCode || 'N/A',
            'Status': reg.status,
            'Assigned Domain': reg.assignedDomain || 'N/A',
            'Registration Date': reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : 'N/A',
        };

        // Custom Answers
        if (reg.customAnswers) {
            Object.entries(reg.customAnswers).forEach(([key, value]) => {
                row[`Answer: ${key}`] = value;
            });
        }

        // Domain Priorities
        if (Array.isArray(reg.domainPriorities)) {
            reg.domainPriorities.forEach((p: string, idx: number) => {
                row[`Priority ${idx + 1}`] = p;
            });
        }

        // Checkpoints (Submissions)
        if (Array.isArray(reg.checkpoints)) {
            // Sort by week number
            const checkpoints = [...reg.checkpoints].sort((a, b) => a.weekNumber - b.weekNumber);
            checkpoints.forEach((cp: any) => {
                row[`Week ${cp.weekNumber} Submission`] = cp.submissionContent || 'No Content';
                row[`Week ${cp.weekNumber} Feedback`] = cp.mentorFeedback || 'N/A';
                row[`Week ${cp.weekNumber} Approved`] = cp.isApproved ? 'Yes' : (cp.isApproved === false ? 'No' : 'Pending');
            });
        }

        return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    // Auto-width columns
    const max_width = rows.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
    worksheet["!cols"] = Array(20).fill({ wch: 20 }); // simple fixed width for now, or calculate

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
