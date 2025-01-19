import { Resend } from 'resend';
import AssignedTaskEmail from './assigned-task';

import { config } from "../../../backend/src/config/app.config";
const resend = new Resend(config.RESEND_API_KEY);

interface SendTaskAssignmentEmailProps {
    sender: string;
    receiver: string;
    task_name: string;
    task_link: string;
}

export const sendTaskAssignmentEmail = async (props: SendTaskAssignmentEmailProps) => {
    const { sender, receiver, task_name, task_link } = props;

    const emailContent = AssignedTaskEmail({
        sender,
        receiver,
        task_name,
        task_link,
    });

    try {
        await resend.emails.send({
            from: sender,
            to: receiver,
            subject: `You've been assigned a new task: ${task_name}`,
            react: emailContent,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};