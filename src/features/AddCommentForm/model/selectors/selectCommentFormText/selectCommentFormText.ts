import { StateSchema } from 'app/providers/StoreProvider';

export const selectCommentFormText = (state: StateSchema) => state.addCommentForm?.text || '';