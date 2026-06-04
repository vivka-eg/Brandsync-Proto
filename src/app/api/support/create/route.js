import { NextResponse } from 'next/server';
import https from 'https';

// Disable SSL verification
const agent = new https.Agent({ rejectUnauthorized: false });

export async function POST(request) {
    try {
        console.log("Received request to create JIRA issue");

        const formData = await request.formData();

        const summary = formData.get('summary');
        const description = formData.get('description');
        const priority = formData.get('priority');
        const assignee = formData.get('assignee');
        const userEmail = formData.get('userEmail');

        console.log("Request data:", { summary, description, priority, assignee, userEmail });

        const url = "https://jira.eg.dk/rest/api/2/issue";
        
        // PAT token
        const token = process.env.JIRA_API_TOKEN;

        const assigneeEmail = "mamsh@eg.dk";

        const data = {
            fields: {
                project: { key: "IM" },
                summary: summary,
                description: description,
                issuetype: { name: "Task" },
                priority: { name: priority || "Medium" },
                assignee: { name: assigneeEmail },
                customfield_10101: "IM-1594",
                customfield_11200: { value: "1 - Normal" },
                customfield_11201: { value: "2 - Normal data - INTERNAL" },
                customfield_10210: { value: "0 - None" },
                customfield_10213: { value: "Internal company work" }
            }
        };

        console.log("Sending to JIRA:", JSON.stringify(data, null, 2));

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data),
            agent
        });

        const responseText = await response.text();
        const responseData = responseText ? JSON.parse(responseText) : {};

        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch {
                errorData = { rawResponse: responseText };
            }

            const errorMessage = errorData.errorMessages?.[0] ||
                errorData.errors ? Object.values(errorData.errors).join(', ') :
                `JIRA API Error: ${response.status}`;

            throw new Error(errorMessage);
        }

        // Move issue to "Ready" status
        try {
            console.log(`Moving issue ${responseData.key} to Ready status...`);
            
            const transitionsResponse = await fetch(
                `https://jira.eg.dk/rest/api/2/issue/${responseData.key}/transitions`,
                {
                    method: 'GET',
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    agent
                }
            );

            const transitionsData = await transitionsResponse.json();
            console.log('Available transitions:', JSON.stringify(transitionsData, null, 2));

            const readyTransition = transitionsData.transitions?.find(
                t => t.name.toLowerCase() === 'ready' || t.to.name.toLowerCase() === 'ready'
            );

            if (readyTransition) {
                const transitionResponse = await fetch(
                    `https://jira.eg.dk/rest/api/2/issue/${responseData.key}/transitions`,
                    {
                        method: 'POST',
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            transition: {
                                id: readyTransition.id
                            }
                        }),
                        agent
                    }
                );

                if (transitionResponse.ok) {
                    console.log(`Successfully moved issue ${responseData.key} to Ready status`);
                } else {
                    const transitionError = await transitionResponse.text();
                    console.error('Failed to transition issue:', transitionError);
                }
            } else {
                console.log('Ready transition not found. Available transitions:', 
                    transitionsData.transitions?.map(t => t.name).join(', '));
            }
        } catch (transitionError) {
            console.error('Error transitioning issue to Ready:', transitionError);
        }

        let result;
        try {
            result = JSON.parse(responseText);
        } catch {
            result = { rawResponse: responseText };
        }

        return NextResponse.json({
            success: true,
            issueKey: result.key,
            issueId: result.id,
            message: 'Issue created successfully',
            jiraResponse: result
        });

    } catch (error) {
        console.error('Error creating JIRA issue:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}