import mongoose, { Schema, Document } from 'mongoose';

interface IReport extends Document {
    title: string;
    description: string;
    created_by: string;
    tag: string;
    file_url: string;
    created_at: Date;
    workspace_id: mongoose.Types.ObjectId;
}

const ReportSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    created_by: { type: String, required: true },
    tag: { type: String, required: true },
    file_url: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    workspace_id: { type: mongoose.Types.ObjectId, ref: 'Workspace', required: true }
});

const Report = mongoose.model<IReport>('Report', ReportSchema);

export default Report;