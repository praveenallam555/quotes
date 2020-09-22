export interface Quote {
    id: string;
    content: string;
    author: string;
    date: string;
    favoriteCount: number;
    photoURL: string;
    uid: string;
    userFavorite?:boolean;
    userFavoriteData?: any;
}