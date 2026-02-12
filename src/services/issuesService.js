const IssuesService = {
  async fetchAllIssues() {
    const response = await fetch(
      "https://uat.smartassistapp.in/api//global/issues/all",
    );
    const json = await response.json();
    return json.data || [];
  },

  async updateIssue(ticketId, payload) {
    const response = await fetch(
      `https://uat.smartassistapp.in/api//global/update-issue/${ticketId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) throw new Error("Failed to update issue");
    return response.json();
  },
};

export default IssuesService;
