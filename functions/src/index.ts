
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

admin.initializeApp();
const db = admin.firestore();

export const processOptionProposal = functions.firestore
    .document("proposals/{proposalId}/comments/{commentId}")
    .onCreate(async (snapshot, context) => {
        const commentData = snapshot.data();
        const { proposalId, commentId } = context.params;

        if (!commentData.isOptionProposal) {
            functions.logger.log(`Comment ${commentId} is not an option proposal.`);
            return null;
        }
        if (!commentData.content || !commentData.author?.uid) {
             functions.logger.error(`Comment ${commentId} is missing data.`);
             return null;
        }

        const proposalRef = db.doc(`proposals/${proposalId}`);

        try {
            const newOption = {
                id: `opc_${uuidv4()}`,
                text: commentData.content,
                votes: 0,
                proposerId: commentData.author.uid,
                proposerName: commentData.author.name,
            };

            await proposalRef.update({
                options: admin.firestore.FieldValue.arrayUnion(newOption),
            });

            functions.logger.log(`Added new option to proposal ${proposalId}.`);
            await snapshot.ref.update({ isProcessed: true });
            return { status: "success" };
        } catch (error) {
            functions.logger.error(`Failed to add option to proposal ${proposalId}:`, error);
            await snapshot.ref.update({ processingError: true });
            return null;
        }
    });
