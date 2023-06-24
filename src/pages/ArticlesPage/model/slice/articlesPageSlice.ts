import { StateSchema } from 'app/providers/StoreProvider';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article, ArticleView } from 'entities/Article';
import { ArticlesPageSchema } from '../types/articlesPageSchema';
import { fetchArticlesList } from '../services/fetchArticlesList/fetchArticlesList';

const initialState: ArticlesPageSchema = {
    loading: false,
    error: undefined,
    ids: [],
    entities: {},
    view: 'GRID',
    page: 1,
    hasMore: true,
    limit: 9
};

const articlesAdapter = createEntityAdapter<Article>();
  

export const ArticlesPageSlice = createSlice({
    name: 'articlesPage',
    initialState: articlesAdapter.getInitialState(initialState),
    reducers: {
        setView: (state, action: PayloadAction<ArticleView>) => {
            state.view = action.payload;
            state.limit = action.payload === 'GRID' ? 9 : 4;
        },

        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchArticlesList.pending, (state) => {
                state.loading = true;
                state.error = undefined;

            })
            .addCase(fetchArticlesList.fulfilled, (state, action: PayloadAction<Array<Article>>) => {
                state.loading = false;
                state.hasMore = action.payload.length > 0;
                articlesAdapter.addMany(state, action.payload);

            })
            .addCase(fetchArticlesList.rejected, (state, action) => {
                state.loading = false; 
                state.error = action.payload;

            });
    }
   
});

export const articlesSelectors = articlesAdapter.getSelectors<StateSchema>(state => 
    state.articlesPage || initialState);



export const { actions: articlesPageActions } = ArticlesPageSlice;
export const { reducer: articlesPageReducer } = ArticlesPageSlice;