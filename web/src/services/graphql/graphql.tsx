import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The `ID` scalar type represents a unique MongoDB identifier in collection. MongoDB by default use 12-byte ObjectId value (https://docs.mongodb.com/manual/reference/bson-types/#objectid). But MongoDB also may accepts string or integer as correct values for _id field. */
  MongoID: any;
  /** The string representation of JavaScript regexp. You may provide it with flags "/^abc.*\/i" or without flags like "^abc.*". More info about RegExp characters and flags: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions */
  RegExpAsString: any;
};

export type ValidationError = ErrorInterface & {
  __typename?: 'ValidationError';
  /** Combined error message from all validators */
  message?: Maybe<Scalars['String']>;
  /** List of validator errors */
  errors?: Maybe<Array<ValidatorError>>;
};

export type ErrorInterface = {
  /** Generic error message */
  message?: Maybe<Scalars['String']>;
};

export type ValidatorError = {
  __typename?: 'ValidatorError';
  /** Validation error message */
  message?: Maybe<Scalars['String']>;
  /** Source of the validation error from the model path */
  path?: Maybe<Scalars['String']>;
  /** Field value which occurs the validation error */
  value?: Maybe<Scalars['JSON']>;
  /** Input record idx in array which occurs the validation error. This `idx` is useful for createMany operation. For singular operations it always be 0. For *Many operations `idx` represents record index in array received from user. */
  idx: Scalars['Int'];
};


export type MongoError = ErrorInterface & {
  __typename?: 'MongoError';
  /** MongoDB error message */
  message?: Maybe<Scalars['String']>;
  /** MongoDB error code */
  code?: Maybe<Scalars['Int']>;
};

export type RuntimeError = ErrorInterface & {
  __typename?: 'RuntimeError';
  /** Runtime error message */
  message?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  trackById?: Maybe<Track>;
  trackByIds: Array<Track>;
  trackOne?: Maybe<Track>;
  trackMany: Array<Track>;
  trackDataLoader?: Maybe<Track>;
  trackDataLoaderMany: Array<Maybe<Track>>;
  trackCount?: Maybe<Scalars['Int']>;
  trackConnection?: Maybe<TrackConnection>;
  trackPagination?: Maybe<TrackPagination>;
  trackRecents: Array<Track>;
  playlistById?: Maybe<Playlist>;
  playlistByIdUpdated?: Maybe<Playlist>;
  playlistByIds: Array<Playlist>;
  playlistOne?: Maybe<Playlist>;
  playlistMany: Array<Playlist>;
  playlistDataLoader?: Maybe<Playlist>;
  playlistDataLoaderMany: Array<Maybe<Playlist>>;
  playlistCount?: Maybe<Scalars['Int']>;
  playlistConnection?: Maybe<PlaylistConnection>;
  playlistPagination?: Maybe<PlaylistPagination>;
  playlistRecents: Array<Playlist>;
  soundboardItemById?: Maybe<SoundboardItem>;
  soundboardItemByIds: Array<SoundboardItem>;
  soundboardItemOne?: Maybe<SoundboardItem>;
  soundboardItemMany: Array<SoundboardItem>;
  soundboardItemDataLoader?: Maybe<SoundboardItem>;
  soundboardItemDataLoaderMany: Array<Maybe<SoundboardItem>>;
  soundboardItemCount?: Maybe<Scalars['Int']>;
  soundboardItemConnection?: Maybe<SoundboardItemConnection>;
  soundboardItemPagination?: Maybe<SoundboardItemPagination>;
  getGuilds?: Maybe<Array<Guild>>;
  getPlayer?: Maybe<Player>;
};


export type QueryTrackByIdArgs = {
  _id: Scalars['MongoID'];
};


export type QueryTrackByIdsArgs = {
  _ids: Array<Scalars['MongoID']>;
  limit?: Maybe<Scalars['Int']>;
  sort?: Maybe<SortFindByIdsTrackInput>;
};


export type QueryTrackOneArgs = {
  filter?: Maybe<FilterFindOneTrackInput>;
  skip?: Maybe<Scalars['Int']>;
  sort?: Maybe<SortFindOneTrackInput>;
};


export type QueryTrackManyArgs = {
  filter?: Maybe<FilterFindManyTrackInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sort?: Maybe<SortFindManyTrackInput>;
};


export type QueryTrackDataLoaderArgs = {
  _id: Scalars['MongoID'];
};


export type QueryTrackDataLoaderManyArgs = {
  _ids: Array<Scalars['MongoID']>;
};


export type QueryTrackCountArgs = {
  filter?: Maybe<FilterCountTrackInput>;
};


export type QueryTrackConnectionArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  filter?: Maybe<FilterFindManyTrackInput>;
  sort?: Maybe<SortConnectionTrackEnum>;
};


export type QueryTrackPaginationArgs = {
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
  filter?: Maybe<FilterFindManyTrackInput>;
  sort?: Maybe<SortFindManyTrackInput>;
};


export type QueryTrackRecentsArgs = {
  guild?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryPlaylistByIdArgs = {
  _id: Scalars['MongoID'];
};


export type QueryPlaylistByIdUpdatedArgs = {
  _id: Scalars['MongoID'];
};


export type QueryPlaylistByIdsArgs = {
  _ids: Array<Scalars['MongoID']>;
  limit?: Maybe<Scalars['Int']>;
  sort?: Maybe<SortFindByIdsPlaylistInput>;
};


export type QueryPlaylistOneArgs = {
  filter?: Maybe<FilterFindOnePlaylistInput>;
  skip?: Maybe<Scalars['Int']>;
  sort?: Maybe<SortFindOnePlaylistInput>;
};


export type QueryPlaylistManyArgs = {
  filter?: Maybe<FilterFindManyPlaylistInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<SortFindManyPlaylistInput>>;
};


export type QueryPlaylistDataLoaderArgs = {
  _id: Scalars['MongoID'];
};


export type QueryPlaylistDataLoaderManyArgs = {
  _ids: Array<Scalars['MongoID']>;
};


export type QueryPlaylistCountArgs = {
  filter?: Maybe<FilterCountPlaylistInput>;
};


export type QueryPlaylistConnectionArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  filter?: Maybe<FilterFindManyPlaylistInput>;
  sort?: Maybe<SortConnectionPlaylistEnum>;
};


export type QueryPlaylistPaginationArgs = {
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
  filter?: Maybe<FilterFindManyPlaylistInput>;
  sort?: Maybe<SortFindManyPlaylistInput>;
};


export type QueryPlaylistRecentsArgs = {
  guild?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QuerySoundboardItemByIdArgs = {
  _id: Scalars['MongoID'];
};


export type QuerySoundboardItemByIdsArgs = {
  _ids: Array<Scalars['MongoID']>;
  limit?: Maybe<Scalars['Int']>;
  sort?: Maybe<SortFindByIdsSoundboardItemInput>;
};


export type QuerySoundboardItemOneArgs = {
  filter?: Maybe<FilterFindOneSoundboardItemInput>;
  skip?: Maybe<Scalars['Int']>;
  sort?: Maybe<SortFindOneSoundboardItemInput>;
};


export type QuerySoundboardItemManyArgs = {
  filter?: Maybe<FilterFindManySoundboardItemInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sort?: Maybe<SortFindManySoundboardItemInput>;
};


export type QuerySoundboardItemDataLoaderArgs = {
  _id: Scalars['MongoID'];
};


export type QuerySoundboardItemDataLoaderManyArgs = {
  _ids: Array<Scalars['MongoID']>;
};


export type QuerySoundboardItemCountArgs = {
  filter?: Maybe<FilterCountSoundboardItemInput>;
};


export type QuerySoundboardItemConnectionArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  filter?: Maybe<FilterFindManySoundboardItemInput>;
  sort?: Maybe<SortConnectionSoundboardItemEnum>;
};


export type QuerySoundboardItemPaginationArgs = {
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
  filter?: Maybe<FilterFindManySoundboardItemInput>;
  sort?: Maybe<SortFindManySoundboardItemInput>;
};


export type QueryGetPlayerArgs = {
  guild: Scalars['String'];
};

export type Track = {
  __typename?: 'Track';
  artists?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<TrackFavourite>>>;
  lastTouchedAt?: Maybe<Array<Maybe<TrackLastTouchedAt>>>;
  source: Scalars['String'];
  title: Scalars['String'];
  thumbnail?: Maybe<TrackThumbnail>;
  touchedByUser?: Maybe<Array<Maybe<TrackTouchedByUser>>>;
  url?: Maybe<Scalars['String']>;
  _id: Scalars['MongoID'];
};

export type TrackFavourite = {
  __typename?: 'TrackFavourite';
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};


export type TrackLastTouchedAt = {
  __typename?: 'TrackLastTouchedAt';
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type TrackThumbnail = {
  __typename?: 'TrackThumbnail';
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type TrackTouchedByUser = {
  __typename?: 'TrackTouchedByUser';
  guild?: Maybe<Scalars['String']>;
  touched?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export enum SortFindByIdsTrackInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type FilterFindOneTrackInput = {
  artists?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<FilterFindOneTrackFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<FilterFindOneTrackLastTouchedAtInput>>>;
  source?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<FilterFindOneTrackThumbnailInput>;
  touchedByUser?: Maybe<Array<Maybe<FilterFindOneTrackTouchedByUserInput>>>;
  url?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterFindOneTrackOperatorsInput>;
  OR?: Maybe<Array<FilterFindOneTrackInput>>;
  AND?: Maybe<Array<FilterFindOneTrackInput>>;
};

export type FilterFindOneTrackFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterFindOneTrackLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterFindOneTrackThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type FilterFindOneTrackTouchedByUserInput = {
  guild?: Maybe<Scalars['String']>;
  touched?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneTrackOperatorsInput = {
  _id?: Maybe<FilterFindOneTrack_IdOperatorsInput>;
};

export type FilterFindOneTrack_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortFindOneTrackInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type FilterFindManyTrackInput = {
  artists?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<FilterFindManyTrackFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<FilterFindManyTrackLastTouchedAtInput>>>;
  source?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<FilterFindManyTrackThumbnailInput>;
  touchedByUser?: Maybe<Array<Maybe<FilterFindManyTrackTouchedByUserInput>>>;
  url?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterFindManyTrackOperatorsInput>;
  OR?: Maybe<Array<FilterFindManyTrackInput>>;
  AND?: Maybe<Array<FilterFindManyTrackInput>>;
};

export type FilterFindManyTrackFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterFindManyTrackLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterFindManyTrackThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type FilterFindManyTrackTouchedByUserInput = {
  guild?: Maybe<Scalars['String']>;
  touched?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyTrackOperatorsInput = {
  artists?: Maybe<FilterFindManyTrackArtistsOperatorsInput>;
  favourite?: Maybe<FilterFindManyTrackFavouriteOperatorsInput>;
  lastTouchedAt?: Maybe<FilterFindManyTrackLastTouchedAtOperatorsInput>;
  source?: Maybe<FilterFindManyTrackSourceOperatorsInput>;
  title?: Maybe<FilterFindManyTrackTitleOperatorsInput>;
  thumbnail?: Maybe<FilterFindManyTrackThumbnailOperatorsInput>;
  touchedByUser?: Maybe<FilterFindManyTrackTouchedByUserOperatorsInput>;
  url?: Maybe<FilterFindManyTrackUrlOperatorsInput>;
  _id?: Maybe<FilterFindManyTrack_IdOperatorsInput>;
};

export type FilterFindManyTrackArtistsOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};


export type FilterFindManyTrackFavouriteOperatorsInput = {
  guild?: Maybe<FilterFindManyTrackFavouriteGuildOperatorsInput>;
  favourite?: Maybe<FilterFindManyTrackFavouriteFavouriteOperatorsInput>;
  _id?: Maybe<FilterFindManyTrackFavourite_IdOperatorsInput>;
};

export type FilterFindManyTrackFavouriteGuildOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrackFavouriteFavouriteOperatorsInput = {
  gt?: Maybe<Scalars['Boolean']>;
  gte?: Maybe<Scalars['Boolean']>;
  lt?: Maybe<Scalars['Boolean']>;
  lte?: Maybe<Scalars['Boolean']>;
  ne?: Maybe<Scalars['Boolean']>;
  in?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  nin?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrackFavourite_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrackLastTouchedAtOperatorsInput = {
  guild?: Maybe<FilterFindManyTrackLastTouchedAtGuildOperatorsInput>;
  date?: Maybe<FilterFindManyTrackLastTouchedAtDateOperatorsInput>;
  _id?: Maybe<FilterFindManyTrackLastTouchedAt_IdOperatorsInput>;
};

export type FilterFindManyTrackLastTouchedAtGuildOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrackLastTouchedAtDateOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrackLastTouchedAt_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrackSourceOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrackTitleOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrackThumbnailOperatorsInput = {
  small?: Maybe<FilterFindManyTrackThumbnailSmallOperatorsInput>;
  medium?: Maybe<FilterFindManyTrackThumbnailMediumOperatorsInput>;
  large?: Maybe<FilterFindManyTrackThumbnailLargeOperatorsInput>;
};

export type FilterFindManyTrackThumbnailSmallOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrackThumbnailMediumOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrackThumbnailLargeOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrackTouchedByUserOperatorsInput = {
  guild?: Maybe<FilterFindManyTrackTouchedByUserGuildOperatorsInput>;
  touched?: Maybe<FilterFindManyTrackTouchedByUserTouchedOperatorsInput>;
  _id?: Maybe<FilterFindManyTrackTouchedByUser_IdOperatorsInput>;
};

export type FilterFindManyTrackTouchedByUserGuildOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrackTouchedByUserTouchedOperatorsInput = {
  gt?: Maybe<Scalars['Boolean']>;
  gte?: Maybe<Scalars['Boolean']>;
  lt?: Maybe<Scalars['Boolean']>;
  lte?: Maybe<Scalars['Boolean']>;
  ne?: Maybe<Scalars['Boolean']>;
  in?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  nin?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrackTouchedByUser_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrackUrlOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyTrack_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortFindManyTrackInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type FilterCountTrackInput = {
  artists?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<FilterCountTrackFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<FilterCountTrackLastTouchedAtInput>>>;
  source?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<FilterCountTrackThumbnailInput>;
  touchedByUser?: Maybe<Array<Maybe<FilterCountTrackTouchedByUserInput>>>;
  url?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterCountTrackOperatorsInput>;
  OR?: Maybe<Array<FilterCountTrackInput>>;
  AND?: Maybe<Array<FilterCountTrackInput>>;
};

export type FilterCountTrackFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterCountTrackLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterCountTrackThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type FilterCountTrackTouchedByUserInput = {
  guild?: Maybe<Scalars['String']>;
  touched?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterCountTrackOperatorsInput = {
  _id?: Maybe<FilterCountTrack_IdOperatorsInput>;
};

export type FilterCountTrack_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

/** A connection to a list of items. */
export type TrackConnection = {
  __typename?: 'TrackConnection';
  /** Total object count. */
  count: Scalars['Int'];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Information to aid in pagination. */
  edges: Array<TrackEdge>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
};

/** An edge in a connection. */
export type TrackEdge = {
  __typename?: 'TrackEdge';
  /** The item at the end of the edge */
  node: Track;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export enum SortConnectionTrackEnum {
  IdDesc = '_ID_DESC',
  IdAsc = '_ID_ASC'
}

/** List of items with pagination. */
export type TrackPagination = {
  __typename?: 'TrackPagination';
  /** Total object count. */
  count?: Maybe<Scalars['Int']>;
  /** Array of objects. */
  items?: Maybe<Array<Track>>;
  /** Information to aid in pagination. */
  pageInfo: PaginationInfo;
};

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  currentPage: Scalars['Int'];
  perPage: Scalars['Int'];
  pageCount?: Maybe<Scalars['Int']>;
  itemCount?: Maybe<Scalars['Int']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']>;
};

export type Playlist = {
  __typename?: 'Playlist';
  identifier: Scalars['String'];
  favourite?: Maybe<Array<Maybe<PlaylistFavourite>>>;
  lastTouchedAt?: Maybe<Array<Maybe<PlaylistLastTouchedAt>>>;
  name: Scalars['String'];
  owner?: Maybe<Scalars['String']>;
  source: Scalars['String'];
  tracks?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  thumbnail?: Maybe<PlaylistThumbnail>;
  uri?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  _id: Scalars['MongoID'];
};

export type PlaylistFavourite = {
  __typename?: 'PlaylistFavourite';
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type PlaylistLastTouchedAt = {
  __typename?: 'PlaylistLastTouchedAt';
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type PlaylistThumbnail = {
  __typename?: 'PlaylistThumbnail';
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export enum SortFindByIdsPlaylistInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  IdentifierAsc = 'IDENTIFIER_ASC',
  IdentifierDesc = 'IDENTIFIER_DESC'
}

export type FilterFindOnePlaylistInput = {
  identifier?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<FilterFindOnePlaylistFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<FilterFindOnePlaylistLastTouchedAtInput>>>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  tracks?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  thumbnail?: Maybe<FilterFindOnePlaylistThumbnailInput>;
  uri?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterFindOnePlaylistOperatorsInput>;
  OR?: Maybe<Array<FilterFindOnePlaylistInput>>;
  AND?: Maybe<Array<FilterFindOnePlaylistInput>>;
};

export type FilterFindOnePlaylistFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterFindOnePlaylistLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterFindOnePlaylistThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOnePlaylistOperatorsInput = {
  identifier?: Maybe<FilterFindOnePlaylistIdentifierOperatorsInput>;
  _id?: Maybe<FilterFindOnePlaylist_IdOperatorsInput>;
};

export type FilterFindOnePlaylistIdentifierOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindOnePlaylist_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortFindOnePlaylistInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  IdentifierAsc = 'IDENTIFIER_ASC',
  IdentifierDesc = 'IDENTIFIER_DESC'
}

export type FilterFindManyPlaylistInput = {
  identifier?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<FilterFindManyPlaylistFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<FilterFindManyPlaylistLastTouchedAtInput>>>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  tracks?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  thumbnail?: Maybe<FilterFindManyPlaylistThumbnailInput>;
  uri?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterFindManyPlaylistOperatorsInput>;
  OR?: Maybe<Array<FilterFindManyPlaylistInput>>;
  AND?: Maybe<Array<FilterFindManyPlaylistInput>>;
};

export type FilterFindManyPlaylistFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterFindManyPlaylistLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterFindManyPlaylistThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManyPlaylistOperatorsInput = {
  identifier?: Maybe<FilterFindManyPlaylistIdentifierOperatorsInput>;
  _id?: Maybe<FilterFindManyPlaylist_IdOperatorsInput>;
};

export type FilterFindManyPlaylistIdentifierOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManyPlaylist_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortFindManyPlaylistInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  IdentifierAsc = 'IDENTIFIER_ASC',
  IdentifierDesc = 'IDENTIFIER_DESC'
}

export type FilterCountPlaylistInput = {
  identifier?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<FilterCountPlaylistFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<FilterCountPlaylistLastTouchedAtInput>>>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  tracks?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  thumbnail?: Maybe<FilterCountPlaylistThumbnailInput>;
  uri?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterCountPlaylistOperatorsInput>;
  OR?: Maybe<Array<FilterCountPlaylistInput>>;
  AND?: Maybe<Array<FilterCountPlaylistInput>>;
};

export type FilterCountPlaylistFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterCountPlaylistLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterCountPlaylistThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterCountPlaylistOperatorsInput = {
  identifier?: Maybe<FilterCountPlaylistIdentifierOperatorsInput>;
  _id?: Maybe<FilterCountPlaylist_IdOperatorsInput>;
};

export type FilterCountPlaylistIdentifierOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterCountPlaylist_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

/** A connection to a list of items. */
export type PlaylistConnection = {
  __typename?: 'PlaylistConnection';
  /** Total object count. */
  count: Scalars['Int'];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Information to aid in pagination. */
  edges: Array<PlaylistEdge>;
};

/** An edge in a connection. */
export type PlaylistEdge = {
  __typename?: 'PlaylistEdge';
  /** The item at the end of the edge */
  node: Playlist;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export enum SortConnectionPlaylistEnum {
  IdDesc = '_ID_DESC',
  IdAsc = '_ID_ASC',
  IdentifierDesc = 'IDENTIFIER_DESC',
  IdentifierAsc = 'IDENTIFIER_ASC'
}

/** List of items with pagination. */
export type PlaylistPagination = {
  __typename?: 'PlaylistPagination';
  /** Total object count. */
  count?: Maybe<Scalars['Int']>;
  /** Array of objects. */
  items?: Maybe<Array<Playlist>>;
  /** Information to aid in pagination. */
  pageInfo: PaginationInfo;
};

export type SoundboardItem = {
  __typename?: 'SoundboardItem';
  guild: Scalars['String'];
  source: Scalars['String'];
  name: Scalars['String'];
  _id: Scalars['MongoID'];
};

export enum SortFindByIdsSoundboardItemInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  GuildAsc = 'GUILD_ASC',
  GuildDesc = 'GUILD_DESC',
  GuildNameAsc = 'GUILD__NAME_ASC',
  GuildNameDesc = 'GUILD__NAME_DESC'
}

export type FilterFindOneSoundboardItemInput = {
  guild?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterFindOneSoundboardItemOperatorsInput>;
  OR?: Maybe<Array<FilterFindOneSoundboardItemInput>>;
  AND?: Maybe<Array<FilterFindOneSoundboardItemInput>>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindOneSoundboardItemOperatorsInput = {
  guild?: Maybe<FilterFindOneSoundboardItemGuildOperatorsInput>;
  _id?: Maybe<FilterFindOneSoundboardItem_IdOperatorsInput>;
};

export type FilterFindOneSoundboardItemGuildOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindOneSoundboardItem_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortFindOneSoundboardItemInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  GuildAsc = 'GUILD_ASC',
  GuildDesc = 'GUILD_DESC',
  GuildNameAsc = 'GUILD__NAME_ASC',
  GuildNameDesc = 'GUILD__NAME_DESC'
}

export type FilterFindManySoundboardItemInput = {
  guild?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterFindManySoundboardItemOperatorsInput>;
  OR?: Maybe<Array<FilterFindManySoundboardItemInput>>;
  AND?: Maybe<Array<FilterFindManySoundboardItemInput>>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterFindManySoundboardItemOperatorsInput = {
  guild?: Maybe<FilterFindManySoundboardItemGuildOperatorsInput>;
  _id?: Maybe<FilterFindManySoundboardItem_IdOperatorsInput>;
};

export type FilterFindManySoundboardItemGuildOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterFindManySoundboardItem_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortFindManySoundboardItemInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  GuildAsc = 'GUILD_ASC',
  GuildDesc = 'GUILD_DESC',
  GuildNameAsc = 'GUILD__NAME_ASC',
  GuildNameDesc = 'GUILD__NAME_DESC'
}

export type FilterCountSoundboardItemInput = {
  guild?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterCountSoundboardItemOperatorsInput>;
  OR?: Maybe<Array<FilterCountSoundboardItemInput>>;
  AND?: Maybe<Array<FilterCountSoundboardItemInput>>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterCountSoundboardItemOperatorsInput = {
  guild?: Maybe<FilterCountSoundboardItemGuildOperatorsInput>;
  _id?: Maybe<FilterCountSoundboardItem_IdOperatorsInput>;
};

export type FilterCountSoundboardItemGuildOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterCountSoundboardItem_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

/** A connection to a list of items. */
export type SoundboardItemConnection = {
  __typename?: 'SoundboardItemConnection';
  /** Total object count. */
  count: Scalars['Int'];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Information to aid in pagination. */
  edges: Array<SoundboardItemEdge>;
};

/** An edge in a connection. */
export type SoundboardItemEdge = {
  __typename?: 'SoundboardItemEdge';
  /** The item at the end of the edge */
  node: SoundboardItem;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export enum SortConnectionSoundboardItemEnum {
  IdDesc = '_ID_DESC',
  IdAsc = '_ID_ASC',
  GuildNameDesc = 'GUILD__NAME_DESC',
  GuildNameAsc = 'GUILD__NAME_ASC'
}

/** List of items with pagination. */
export type SoundboardItemPagination = {
  __typename?: 'SoundboardItemPagination';
  /** Total object count. */
  count?: Maybe<Scalars['Int']>;
  /** Array of objects. */
  items?: Maybe<Array<SoundboardItem>>;
  /** Information to aid in pagination. */
  pageInfo: PaginationInfo;
};

export type Guild = {
  __typename?: 'Guild';
  id: Scalars['String'];
  name: Scalars['String'];
  members?: Maybe<Array<Member>>;
};

export type Member = {
  __typename?: 'Member';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type Player = {
  __typename?: 'Player';
  available: Scalars['Boolean'];
  currentTrackID?: Maybe<Scalars['MongoID']>;
  loopState: Scalars['String'];
  paused: Scalars['Boolean'];
  queueIDs: Array<Scalars['MongoID']>;
  volume: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create one document with mongoose defaults, setters, hooks and validation */
  trackCreateOne?: Maybe<CreateOneTrackPayload>;
  /** Creates Many documents with mongoose defaults, setters, hooks and validation */
  trackCreateMany?: Maybe<CreateManyTrackPayload>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  trackUpdateById?: Maybe<UpdateByIdTrackPayload>;
  /** Update one document: 1) Retrieve one document via findOne. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  trackUpdateOne?: Maybe<UpdateOneTrackPayload>;
  /** Update many documents without returning them: Use Query.update mongoose method. Do not apply mongoose defaults, setters, hooks and validation.  */
  trackUpdateMany?: Maybe<UpdateManyTrackPayload>;
  /** Remove one document: 1) Retrieve one document and remove with hooks via findByIdAndRemove. 2) Return removed document. */
  trackRemoveById?: Maybe<RemoveByIdTrackPayload>;
  /** Remove one document: 1) Remove with hooks via findOneAndRemove. 2) Return removed document. */
  trackRemoveOne?: Maybe<RemoveOneTrackPayload>;
  /** Remove many documents without returning them: Use Query.remove mongoose method. Do not apply mongoose defaults, setters, hooks and validation.  */
  trackRemoveMany?: Maybe<RemoveManyTrackPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  playlistCreateOne?: Maybe<CreateOnePlaylistPayload>;
  /** Creates Many documents with mongoose defaults, setters, hooks and validation */
  playlistCreateMany?: Maybe<CreateManyPlaylistPayload>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  playlistUpdateById?: Maybe<UpdateByIdPlaylistPayload>;
  /** Update one document: 1) Retrieve one document via findOne. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  playlistUpdateOne?: Maybe<UpdateOnePlaylistPayload>;
  /** Update many documents without returning them: Use Query.update mongoose method. Do not apply mongoose defaults, setters, hooks and validation.  */
  playlistUpdateMany?: Maybe<UpdateManyPlaylistPayload>;
  /** Remove one document: 1) Retrieve one document and remove with hooks via findByIdAndRemove. 2) Return removed document. */
  playlistRemoveById?: Maybe<RemoveByIdPlaylistPayload>;
  /** Remove one document: 1) Remove with hooks via findOneAndRemove. 2) Return removed document. */
  playlistRemoveOne?: Maybe<RemoveOnePlaylistPayload>;
  /** Remove many documents without returning them: Use Query.remove mongoose method. Do not apply mongoose defaults, setters, hooks and validation.  */
  playlistRemoveMany?: Maybe<RemoveManyPlaylistPayload>;
  /** Create one document with mongoose defaults, setters, hooks and validation */
  soundboardItemCreateOne?: Maybe<CreateOneSoundboardItemPayload>;
  /** Creates Many documents with mongoose defaults, setters, hooks and validation */
  soundboardItemCreateMany?: Maybe<CreateManySoundboardItemPayload>;
  /** Update one document: 1) Retrieve one document by findById. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  soundboardItemUpdateById?: Maybe<UpdateByIdSoundboardItemPayload>;
  /** Update one document: 1) Retrieve one document via findOne. 2) Apply updates to mongoose document. 3) Mongoose applies defaults, setters, hooks and validation. 4) And save it. */
  soundboardItemUpdateOne?: Maybe<UpdateOneSoundboardItemPayload>;
  /** Update many documents without returning them: Use Query.update mongoose method. Do not apply mongoose defaults, setters, hooks and validation.  */
  soundboardItemUpdateMany?: Maybe<UpdateManySoundboardItemPayload>;
  /** Remove one document: 1) Retrieve one document and remove with hooks via findByIdAndRemove. 2) Return removed document. */
  soundboardItemRemoveById?: Maybe<RemoveByIdSoundboardItemPayload>;
  /** Remove one document: 1) Remove with hooks via findOneAndRemove. 2) Return removed document. */
  soundboardItemRemoveOne?: Maybe<RemoveOneSoundboardItemPayload>;
  /** Remove many documents without returning them: Use Query.remove mongoose method. Do not apply mongoose defaults, setters, hooks and validation.  */
  soundboardItemRemoveMany?: Maybe<RemoveManySoundboardItemPayload>;
  updateQueue?: Maybe<Player>;
};


export type MutationTrackCreateOneArgs = {
  record: CreateOneTrackInput;
};


export type MutationTrackCreateManyArgs = {
  records: Array<CreateManyTrackInput>;
};


export type MutationTrackUpdateByIdArgs = {
  _id: Scalars['MongoID'];
  record: UpdateByIdTrackInput;
};


export type MutationTrackUpdateOneArgs = {
  record: UpdateOneTrackInput;
  filter?: Maybe<FilterUpdateOneTrackInput>;
  sort?: Maybe<SortUpdateOneTrackInput>;
  skip?: Maybe<Scalars['Int']>;
};


export type MutationTrackUpdateManyArgs = {
  record: UpdateManyTrackInput;
  filter?: Maybe<FilterUpdateManyTrackInput>;
  sort?: Maybe<SortUpdateManyTrackInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type MutationTrackRemoveByIdArgs = {
  _id: Scalars['MongoID'];
};


export type MutationTrackRemoveOneArgs = {
  filter?: Maybe<FilterRemoveOneTrackInput>;
  sort?: Maybe<SortRemoveOneTrackInput>;
};


export type MutationTrackRemoveManyArgs = {
  filter: FilterRemoveManyTrackInput;
  limit?: Maybe<Scalars['Int']>;
};


export type MutationPlaylistCreateOneArgs = {
  record: CreateOnePlaylistInput;
};


export type MutationPlaylistCreateManyArgs = {
  records: Array<CreateManyPlaylistInput>;
};


export type MutationPlaylistUpdateByIdArgs = {
  _id: Scalars['MongoID'];
  record: UpdateByIdPlaylistInput;
};


export type MutationPlaylistUpdateOneArgs = {
  record: UpdateOnePlaylistInput;
  filter?: Maybe<FilterUpdateOnePlaylistInput>;
  sort?: Maybe<SortUpdateOnePlaylistInput>;
  skip?: Maybe<Scalars['Int']>;
};


export type MutationPlaylistUpdateManyArgs = {
  record: UpdateManyPlaylistInput;
  filter?: Maybe<FilterUpdateManyPlaylistInput>;
  sort?: Maybe<SortUpdateManyPlaylistInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type MutationPlaylistRemoveByIdArgs = {
  _id: Scalars['MongoID'];
};


export type MutationPlaylistRemoveOneArgs = {
  filter?: Maybe<FilterRemoveOnePlaylistInput>;
  sort?: Maybe<SortRemoveOnePlaylistInput>;
};


export type MutationPlaylistRemoveManyArgs = {
  filter: FilterRemoveManyPlaylistInput;
  limit?: Maybe<Scalars['Int']>;
};


export type MutationSoundboardItemCreateOneArgs = {
  record: CreateOneSoundboardItemInput;
};


export type MutationSoundboardItemCreateManyArgs = {
  records: Array<CreateManySoundboardItemInput>;
};


export type MutationSoundboardItemUpdateByIdArgs = {
  _id: Scalars['MongoID'];
  record: UpdateByIdSoundboardItemInput;
};


export type MutationSoundboardItemUpdateOneArgs = {
  record: UpdateOneSoundboardItemInput;
  filter?: Maybe<FilterUpdateOneSoundboardItemInput>;
  sort?: Maybe<SortUpdateOneSoundboardItemInput>;
  skip?: Maybe<Scalars['Int']>;
};


export type MutationSoundboardItemUpdateManyArgs = {
  record: UpdateManySoundboardItemInput;
  filter?: Maybe<FilterUpdateManySoundboardItemInput>;
  sort?: Maybe<SortUpdateManySoundboardItemInput>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type MutationSoundboardItemRemoveByIdArgs = {
  _id: Scalars['MongoID'];
};


export type MutationSoundboardItemRemoveOneArgs = {
  filter?: Maybe<FilterRemoveOneSoundboardItemInput>;
  sort?: Maybe<SortRemoveOneSoundboardItemInput>;
};


export type MutationSoundboardItemRemoveManyArgs = {
  filter: FilterRemoveManySoundboardItemInput;
  limit?: Maybe<Scalars['Int']>;
};


export type MutationUpdateQueueArgs = {
  guild: Scalars['String'];
  queueIDs: Array<Scalars['String']>;
};

export type CreateOneTrackPayload = {
  __typename?: 'CreateOneTrackPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Created document */
  record?: Maybe<Track>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type CreateOneTrackInput = {
  artists?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<TrackFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<TrackLastTouchedAtInput>>>;
  source: Scalars['String'];
  title: Scalars['String'];
  thumbnail?: Maybe<TrackThumbnailInput>;
  touchedByUser?: Maybe<Array<Maybe<TrackTouchedByUserInput>>>;
  url?: Maybe<Scalars['String']>;
};

export type TrackFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type TrackLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type TrackThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type TrackTouchedByUserInput = {
  guild?: Maybe<Scalars['String']>;
  touched?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type CreateManyTrackPayload = {
  __typename?: 'CreateManyTrackPayload';
  /** Documents IDs */
  recordIds: Array<Scalars['MongoID']>;
  /** Created documents */
  records?: Maybe<Array<Track>>;
  /** Number of created documents */
  createdCount: Scalars['Int'];
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type CreateManyTrackInput = {
  artists?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<TrackFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<TrackLastTouchedAtInput>>>;
  source: Scalars['String'];
  title: Scalars['String'];
  thumbnail?: Maybe<TrackThumbnailInput>;
  touchedByUser?: Maybe<Array<Maybe<TrackTouchedByUserInput>>>;
  url?: Maybe<Scalars['String']>;
};

export type UpdateByIdTrackPayload = {
  __typename?: 'UpdateByIdTrackPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Updated document */
  record?: Maybe<Track>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type UpdateByIdTrackInput = {
  artists?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<UpdateByIdTrackFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<UpdateByIdTrackLastTouchedAtInput>>>;
  source?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<UpdateByIdTrackThumbnailInput>;
  touchedByUser?: Maybe<Array<Maybe<UpdateByIdTrackTouchedByUserInput>>>;
  url?: Maybe<Scalars['String']>;
};

export type UpdateByIdTrackFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type UpdateByIdTrackLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type UpdateByIdTrackThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type UpdateByIdTrackTouchedByUserInput = {
  guild?: Maybe<Scalars['String']>;
  touched?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type UpdateOneTrackPayload = {
  __typename?: 'UpdateOneTrackPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Updated document */
  record?: Maybe<Track>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type UpdateOneTrackInput = {
  artists?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<UpdateOneTrackFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<UpdateOneTrackLastTouchedAtInput>>>;
  source?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<UpdateOneTrackThumbnailInput>;
  touchedByUser?: Maybe<Array<Maybe<UpdateOneTrackTouchedByUserInput>>>;
  url?: Maybe<Scalars['String']>;
};

export type UpdateOneTrackFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type UpdateOneTrackLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type UpdateOneTrackThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type UpdateOneTrackTouchedByUserInput = {
  guild?: Maybe<Scalars['String']>;
  touched?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterUpdateOneTrackInput = {
  artists?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<FilterUpdateOneTrackFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<FilterUpdateOneTrackLastTouchedAtInput>>>;
  source?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<FilterUpdateOneTrackThumbnailInput>;
  touchedByUser?: Maybe<Array<Maybe<FilterUpdateOneTrackTouchedByUserInput>>>;
  url?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterUpdateOneTrackOperatorsInput>;
  OR?: Maybe<Array<FilterUpdateOneTrackInput>>;
  AND?: Maybe<Array<FilterUpdateOneTrackInput>>;
};

export type FilterUpdateOneTrackFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterUpdateOneTrackLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterUpdateOneTrackThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type FilterUpdateOneTrackTouchedByUserInput = {
  guild?: Maybe<Scalars['String']>;
  touched?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterUpdateOneTrackOperatorsInput = {
  _id?: Maybe<FilterUpdateOneTrack_IdOperatorsInput>;
};

export type FilterUpdateOneTrack_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortUpdateOneTrackInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type UpdateManyTrackPayload = {
  __typename?: 'UpdateManyTrackPayload';
  /** Affected documents number */
  numAffected?: Maybe<Scalars['Int']>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type UpdateManyTrackInput = {
  artists?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<UpdateManyTrackFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<UpdateManyTrackLastTouchedAtInput>>>;
  source?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<UpdateManyTrackThumbnailInput>;
  touchedByUser?: Maybe<Array<Maybe<UpdateManyTrackTouchedByUserInput>>>;
  url?: Maybe<Scalars['String']>;
};

export type UpdateManyTrackFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type UpdateManyTrackLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type UpdateManyTrackThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type UpdateManyTrackTouchedByUserInput = {
  guild?: Maybe<Scalars['String']>;
  touched?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterUpdateManyTrackInput = {
  artists?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<FilterUpdateManyTrackFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<FilterUpdateManyTrackLastTouchedAtInput>>>;
  source?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<FilterUpdateManyTrackThumbnailInput>;
  touchedByUser?: Maybe<Array<Maybe<FilterUpdateManyTrackTouchedByUserInput>>>;
  url?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterUpdateManyTrackOperatorsInput>;
  OR?: Maybe<Array<FilterUpdateManyTrackInput>>;
  AND?: Maybe<Array<FilterUpdateManyTrackInput>>;
};

export type FilterUpdateManyTrackFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterUpdateManyTrackLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterUpdateManyTrackThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type FilterUpdateManyTrackTouchedByUserInput = {
  guild?: Maybe<Scalars['String']>;
  touched?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterUpdateManyTrackOperatorsInput = {
  _id?: Maybe<FilterUpdateManyTrack_IdOperatorsInput>;
};

export type FilterUpdateManyTrack_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortUpdateManyTrackInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type RemoveByIdTrackPayload = {
  __typename?: 'RemoveByIdTrackPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Removed document */
  record?: Maybe<Track>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type RemoveOneTrackPayload = {
  __typename?: 'RemoveOneTrackPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Removed document */
  record?: Maybe<Track>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type FilterRemoveOneTrackInput = {
  artists?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<FilterRemoveOneTrackFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<FilterRemoveOneTrackLastTouchedAtInput>>>;
  source?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<FilterRemoveOneTrackThumbnailInput>;
  touchedByUser?: Maybe<Array<Maybe<FilterRemoveOneTrackTouchedByUserInput>>>;
  url?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterRemoveOneTrackOperatorsInput>;
  OR?: Maybe<Array<FilterRemoveOneTrackInput>>;
  AND?: Maybe<Array<FilterRemoveOneTrackInput>>;
};

export type FilterRemoveOneTrackFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterRemoveOneTrackLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterRemoveOneTrackThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type FilterRemoveOneTrackTouchedByUserInput = {
  guild?: Maybe<Scalars['String']>;
  touched?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterRemoveOneTrackOperatorsInput = {
  _id?: Maybe<FilterRemoveOneTrack_IdOperatorsInput>;
};

export type FilterRemoveOneTrack_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortRemoveOneTrackInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type RemoveManyTrackPayload = {
  __typename?: 'RemoveManyTrackPayload';
  /** Affected documents number */
  numAffected?: Maybe<Scalars['Int']>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type FilterRemoveManyTrackInput = {
  artists?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<FilterRemoveManyTrackFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<FilterRemoveManyTrackLastTouchedAtInput>>>;
  source?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<FilterRemoveManyTrackThumbnailInput>;
  touchedByUser?: Maybe<Array<Maybe<FilterRemoveManyTrackTouchedByUserInput>>>;
  url?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterRemoveManyTrackOperatorsInput>;
  OR?: Maybe<Array<FilterRemoveManyTrackInput>>;
  AND?: Maybe<Array<FilterRemoveManyTrackInput>>;
};

export type FilterRemoveManyTrackFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterRemoveManyTrackLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterRemoveManyTrackThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type FilterRemoveManyTrackTouchedByUserInput = {
  guild?: Maybe<Scalars['String']>;
  touched?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterRemoveManyTrackOperatorsInput = {
  _id?: Maybe<FilterRemoveManyTrack_IdOperatorsInput>;
};

export type FilterRemoveManyTrack_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type CreateOnePlaylistPayload = {
  __typename?: 'CreateOnePlaylistPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Created document */
  record?: Maybe<Playlist>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type CreateOnePlaylistInput = {
  identifier: Scalars['String'];
  favourite?: Maybe<Array<Maybe<PlaylistFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<PlaylistLastTouchedAtInput>>>;
  name: Scalars['String'];
  owner?: Maybe<Scalars['String']>;
  source: Scalars['String'];
  tracks?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  thumbnail?: Maybe<PlaylistThumbnailInput>;
  uri?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type PlaylistFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type PlaylistLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type PlaylistThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type CreateManyPlaylistPayload = {
  __typename?: 'CreateManyPlaylistPayload';
  /** Documents IDs */
  recordIds: Array<Scalars['MongoID']>;
  /** Created documents */
  records?: Maybe<Array<Playlist>>;
  /** Number of created documents */
  createdCount: Scalars['Int'];
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type CreateManyPlaylistInput = {
  identifier: Scalars['String'];
  favourite?: Maybe<Array<Maybe<PlaylistFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<PlaylistLastTouchedAtInput>>>;
  name: Scalars['String'];
  owner?: Maybe<Scalars['String']>;
  source: Scalars['String'];
  tracks?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  thumbnail?: Maybe<PlaylistThumbnailInput>;
  uri?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type UpdateByIdPlaylistPayload = {
  __typename?: 'UpdateByIdPlaylistPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Updated document */
  record?: Maybe<Playlist>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type UpdateByIdPlaylistInput = {
  identifier?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<UpdateByIdPlaylistFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<UpdateByIdPlaylistLastTouchedAtInput>>>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  tracks?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  thumbnail?: Maybe<UpdateByIdPlaylistThumbnailInput>;
  uri?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type UpdateByIdPlaylistFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type UpdateByIdPlaylistLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type UpdateByIdPlaylistThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type UpdateOnePlaylistPayload = {
  __typename?: 'UpdateOnePlaylistPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Updated document */
  record?: Maybe<Playlist>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type UpdateOnePlaylistInput = {
  identifier?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<UpdateOnePlaylistFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<UpdateOnePlaylistLastTouchedAtInput>>>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  tracks?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  thumbnail?: Maybe<UpdateOnePlaylistThumbnailInput>;
  uri?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type UpdateOnePlaylistFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type UpdateOnePlaylistLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type UpdateOnePlaylistThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type FilterUpdateOnePlaylistInput = {
  identifier?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<FilterUpdateOnePlaylistFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<FilterUpdateOnePlaylistLastTouchedAtInput>>>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  tracks?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  thumbnail?: Maybe<FilterUpdateOnePlaylistThumbnailInput>;
  uri?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterUpdateOnePlaylistOperatorsInput>;
  OR?: Maybe<Array<FilterUpdateOnePlaylistInput>>;
  AND?: Maybe<Array<FilterUpdateOnePlaylistInput>>;
};

export type FilterUpdateOnePlaylistFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterUpdateOnePlaylistLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterUpdateOnePlaylistThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterUpdateOnePlaylistOperatorsInput = {
  identifier?: Maybe<FilterUpdateOnePlaylistIdentifierOperatorsInput>;
  _id?: Maybe<FilterUpdateOnePlaylist_IdOperatorsInput>;
};

export type FilterUpdateOnePlaylistIdentifierOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterUpdateOnePlaylist_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortUpdateOnePlaylistInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  IdentifierAsc = 'IDENTIFIER_ASC',
  IdentifierDesc = 'IDENTIFIER_DESC'
}

export type UpdateManyPlaylistPayload = {
  __typename?: 'UpdateManyPlaylistPayload';
  /** Affected documents number */
  numAffected?: Maybe<Scalars['Int']>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type UpdateManyPlaylistInput = {
  identifier?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<UpdateManyPlaylistFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<UpdateManyPlaylistLastTouchedAtInput>>>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  tracks?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  thumbnail?: Maybe<UpdateManyPlaylistThumbnailInput>;
  uri?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type UpdateManyPlaylistFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type UpdateManyPlaylistLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type UpdateManyPlaylistThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

export type FilterUpdateManyPlaylistInput = {
  identifier?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<FilterUpdateManyPlaylistFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<FilterUpdateManyPlaylistLastTouchedAtInput>>>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  tracks?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  thumbnail?: Maybe<FilterUpdateManyPlaylistThumbnailInput>;
  uri?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterUpdateManyPlaylistOperatorsInput>;
  OR?: Maybe<Array<FilterUpdateManyPlaylistInput>>;
  AND?: Maybe<Array<FilterUpdateManyPlaylistInput>>;
};

export type FilterUpdateManyPlaylistFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterUpdateManyPlaylistLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterUpdateManyPlaylistThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterUpdateManyPlaylistOperatorsInput = {
  identifier?: Maybe<FilterUpdateManyPlaylistIdentifierOperatorsInput>;
  _id?: Maybe<FilterUpdateManyPlaylist_IdOperatorsInput>;
};

export type FilterUpdateManyPlaylistIdentifierOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterUpdateManyPlaylist_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortUpdateManyPlaylistInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  IdentifierAsc = 'IDENTIFIER_ASC',
  IdentifierDesc = 'IDENTIFIER_DESC'
}

export type RemoveByIdPlaylistPayload = {
  __typename?: 'RemoveByIdPlaylistPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Removed document */
  record?: Maybe<Playlist>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type RemoveOnePlaylistPayload = {
  __typename?: 'RemoveOnePlaylistPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Removed document */
  record?: Maybe<Playlist>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type FilterRemoveOnePlaylistInput = {
  identifier?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<FilterRemoveOnePlaylistFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<FilterRemoveOnePlaylistLastTouchedAtInput>>>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  tracks?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  thumbnail?: Maybe<FilterRemoveOnePlaylistThumbnailInput>;
  uri?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterRemoveOnePlaylistOperatorsInput>;
  OR?: Maybe<Array<FilterRemoveOnePlaylistInput>>;
  AND?: Maybe<Array<FilterRemoveOnePlaylistInput>>;
};

export type FilterRemoveOnePlaylistFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterRemoveOnePlaylistLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterRemoveOnePlaylistThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterRemoveOnePlaylistOperatorsInput = {
  identifier?: Maybe<FilterRemoveOnePlaylistIdentifierOperatorsInput>;
  _id?: Maybe<FilterRemoveOnePlaylist_IdOperatorsInput>;
};

export type FilterRemoveOnePlaylistIdentifierOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterRemoveOnePlaylist_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortRemoveOnePlaylistInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  IdentifierAsc = 'IDENTIFIER_ASC',
  IdentifierDesc = 'IDENTIFIER_DESC'
}

export type RemoveManyPlaylistPayload = {
  __typename?: 'RemoveManyPlaylistPayload';
  /** Affected documents number */
  numAffected?: Maybe<Scalars['Int']>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type FilterRemoveManyPlaylistInput = {
  identifier?: Maybe<Scalars['String']>;
  favourite?: Maybe<Array<Maybe<FilterRemoveManyPlaylistFavouriteInput>>>;
  lastTouchedAt?: Maybe<Array<Maybe<FilterRemoveManyPlaylistLastTouchedAtInput>>>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  tracks?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  thumbnail?: Maybe<FilterRemoveManyPlaylistThumbnailInput>;
  uri?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterRemoveManyPlaylistOperatorsInput>;
  OR?: Maybe<Array<FilterRemoveManyPlaylistInput>>;
  AND?: Maybe<Array<FilterRemoveManyPlaylistInput>>;
};

export type FilterRemoveManyPlaylistFavouriteInput = {
  guild?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterRemoveManyPlaylistLastTouchedAtInput = {
  guild?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
};

export type FilterRemoveManyPlaylistThumbnailInput = {
  small?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['String']>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterRemoveManyPlaylistOperatorsInput = {
  identifier?: Maybe<FilterRemoveManyPlaylistIdentifierOperatorsInput>;
  _id?: Maybe<FilterRemoveManyPlaylist_IdOperatorsInput>;
};

export type FilterRemoveManyPlaylistIdentifierOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterRemoveManyPlaylist_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type CreateOneSoundboardItemPayload = {
  __typename?: 'CreateOneSoundboardItemPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Created document */
  record?: Maybe<SoundboardItem>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type CreateOneSoundboardItemInput = {
  guild: Scalars['String'];
  source: Scalars['String'];
  name: Scalars['String'];
};

export type CreateManySoundboardItemPayload = {
  __typename?: 'CreateManySoundboardItemPayload';
  /** Documents IDs */
  recordIds: Array<Scalars['MongoID']>;
  /** Created documents */
  records?: Maybe<Array<SoundboardItem>>;
  /** Number of created documents */
  createdCount: Scalars['Int'];
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type CreateManySoundboardItemInput = {
  guild: Scalars['String'];
  source: Scalars['String'];
  name: Scalars['String'];
};

export type UpdateByIdSoundboardItemPayload = {
  __typename?: 'UpdateByIdSoundboardItemPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Updated document */
  record?: Maybe<SoundboardItem>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type UpdateByIdSoundboardItemInput = {
  guild?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type UpdateOneSoundboardItemPayload = {
  __typename?: 'UpdateOneSoundboardItemPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Updated document */
  record?: Maybe<SoundboardItem>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type UpdateOneSoundboardItemInput = {
  guild?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type FilterUpdateOneSoundboardItemInput = {
  guild?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterUpdateOneSoundboardItemOperatorsInput>;
  OR?: Maybe<Array<FilterUpdateOneSoundboardItemInput>>;
  AND?: Maybe<Array<FilterUpdateOneSoundboardItemInput>>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterUpdateOneSoundboardItemOperatorsInput = {
  guild?: Maybe<FilterUpdateOneSoundboardItemGuildOperatorsInput>;
  _id?: Maybe<FilterUpdateOneSoundboardItem_IdOperatorsInput>;
};

export type FilterUpdateOneSoundboardItemGuildOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterUpdateOneSoundboardItem_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortUpdateOneSoundboardItemInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  GuildAsc = 'GUILD_ASC',
  GuildDesc = 'GUILD_DESC',
  GuildNameAsc = 'GUILD__NAME_ASC',
  GuildNameDesc = 'GUILD__NAME_DESC'
}

export type UpdateManySoundboardItemPayload = {
  __typename?: 'UpdateManySoundboardItemPayload';
  /** Affected documents number */
  numAffected?: Maybe<Scalars['Int']>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type UpdateManySoundboardItemInput = {
  guild?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type FilterUpdateManySoundboardItemInput = {
  guild?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterUpdateManySoundboardItemOperatorsInput>;
  OR?: Maybe<Array<FilterUpdateManySoundboardItemInput>>;
  AND?: Maybe<Array<FilterUpdateManySoundboardItemInput>>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterUpdateManySoundboardItemOperatorsInput = {
  guild?: Maybe<FilterUpdateManySoundboardItemGuildOperatorsInput>;
  _id?: Maybe<FilterUpdateManySoundboardItem_IdOperatorsInput>;
};

export type FilterUpdateManySoundboardItemGuildOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterUpdateManySoundboardItem_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortUpdateManySoundboardItemInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  GuildAsc = 'GUILD_ASC',
  GuildDesc = 'GUILD_DESC',
  GuildNameAsc = 'GUILD__NAME_ASC',
  GuildNameDesc = 'GUILD__NAME_DESC'
}

export type RemoveByIdSoundboardItemPayload = {
  __typename?: 'RemoveByIdSoundboardItemPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Removed document */
  record?: Maybe<SoundboardItem>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type RemoveOneSoundboardItemPayload = {
  __typename?: 'RemoveOneSoundboardItemPayload';
  /** Document ID */
  recordId?: Maybe<Scalars['MongoID']>;
  /** Removed document */
  record?: Maybe<SoundboardItem>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type FilterRemoveOneSoundboardItemInput = {
  guild?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterRemoveOneSoundboardItemOperatorsInput>;
  OR?: Maybe<Array<FilterRemoveOneSoundboardItemInput>>;
  AND?: Maybe<Array<FilterRemoveOneSoundboardItemInput>>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterRemoveOneSoundboardItemOperatorsInput = {
  guild?: Maybe<FilterRemoveOneSoundboardItemGuildOperatorsInput>;
  _id?: Maybe<FilterRemoveOneSoundboardItem_IdOperatorsInput>;
};

export type FilterRemoveOneSoundboardItemGuildOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterRemoveOneSoundboardItem_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export enum SortRemoveOneSoundboardItemInput {
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  GuildAsc = 'GUILD_ASC',
  GuildDesc = 'GUILD_DESC',
  GuildNameAsc = 'GUILD__NAME_ASC',
  GuildNameDesc = 'GUILD__NAME_DESC'
}

export type RemoveManySoundboardItemPayload = {
  __typename?: 'RemoveManySoundboardItemPayload';
  /** Affected documents number */
  numAffected?: Maybe<Scalars['Int']>;
  /** Error that may occur during operation. If you request this field in GraphQL query, you will receive typed error in payload; otherwise error will be provided in root `errors` field of GraphQL response. */
  error?: Maybe<ErrorInterface>;
};

export type FilterRemoveManySoundboardItemInput = {
  guild?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['MongoID']>;
  /** List of *indexed* fields that can be filtered via operators. */
  _operators?: Maybe<FilterRemoveManySoundboardItemOperatorsInput>;
  OR?: Maybe<Array<FilterRemoveManySoundboardItemInput>>;
  AND?: Maybe<Array<FilterRemoveManySoundboardItemInput>>;
};

/** For performance reason this type contains only *indexed* fields. */
export type FilterRemoveManySoundboardItemOperatorsInput = {
  guild?: Maybe<FilterRemoveManySoundboardItemGuildOperatorsInput>;
  _id?: Maybe<FilterRemoveManySoundboardItem_IdOperatorsInput>;
};

export type FilterRemoveManySoundboardItemGuildOperatorsInput = {
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  ne?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  regex?: Maybe<Scalars['RegExpAsString']>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type FilterRemoveManySoundboardItem_IdOperatorsInput = {
  gt?: Maybe<Scalars['MongoID']>;
  gte?: Maybe<Scalars['MongoID']>;
  lt?: Maybe<Scalars['MongoID']>;
  lte?: Maybe<Scalars['MongoID']>;
  ne?: Maybe<Scalars['MongoID']>;
  in?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  nin?: Maybe<Array<Maybe<Scalars['MongoID']>>>;
  exists?: Maybe<Scalars['Boolean']>;
};

export type GetFavouritesQueryVariables = Exact<{
  guild: Scalars['String'];
}>;


export type GetFavouritesQuery = (
  { __typename?: 'Query' }
  & { playlistMany: Array<(
    { __typename?: 'Playlist' }
    & PlaylistFieldsWithoutTracksFragment
  )>, trackMany: Array<(
    { __typename?: 'Track' }
    & TrackFieldsFragment
  )> }
);

export type GetRecentsQueryVariables = Exact<{
  guild: Scalars['String'];
}>;


export type GetRecentsQuery = (
  { __typename?: 'Query' }
  & { playlistRecents: Array<(
    { __typename?: 'Playlist' }
    & PlaylistFieldsWithoutTracksFragment
  )>, trackRecents: Array<(
    { __typename?: 'Track' }
    & TrackFieldsFragment
  )> }
);

export type GetSoundboardItemsQueryVariables = Exact<{
  guild: Scalars['String'];
}>;


export type GetSoundboardItemsQuery = (
  { __typename?: 'Query' }
  & { soundboardItemMany: Array<(
    { __typename?: 'SoundboardItem' }
    & SoundboardItemFieldsFragment
  )> }
);

export type GetPlaylistByIdQueryVariables = Exact<{
  id: Scalars['MongoID'];
}>;


export type GetPlaylistByIdQuery = (
  { __typename?: 'Query' }
  & { playlistById?: Maybe<(
    { __typename?: 'Playlist' }
    & PlaylistFieldsFragment
  )> }
);

export type GetPlaylistByIdUpdatedQueryVariables = Exact<{
  id: Scalars['MongoID'];
}>;


export type GetPlaylistByIdUpdatedQuery = (
  { __typename?: 'Query' }
  & { playlistByIdUpdated?: Maybe<(
    { __typename?: 'Playlist' }
    & PlaylistFieldsFragment
  )> }
);

export type GetTracksByIdsQueryVariables = Exact<{
  ids: Array<Scalars['MongoID']> | Scalars['MongoID'];
  limit?: Maybe<Scalars['Int']>;
}>;


export type GetTracksByIdsQuery = (
  { __typename?: 'Query' }
  & { trackByIds: Array<(
    { __typename?: 'Track' }
    & TrackFieldsFragment
  )> }
);

export type GetTrackByIdQueryVariables = Exact<{
  id: Scalars['MongoID'];
}>;


export type GetTrackByIdQuery = (
  { __typename?: 'Query' }
  & { trackById?: Maybe<(
    { __typename?: 'Track' }
    & TrackFieldsFragment
  )> }
);

export type GetGuildsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGuildsQuery = (
  { __typename?: 'Query' }
  & { getGuilds?: Maybe<Array<(
    { __typename?: 'Guild' }
    & Pick<Guild, 'id' | 'name'>
    & { members?: Maybe<Array<(
      { __typename?: 'Member' }
      & Pick<Member, 'id' | 'name'>
    )>> }
  )>> }
);

export type GetPlayerQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetPlayerQuery = (
  { __typename?: 'Query' }
  & { getPlayer?: Maybe<(
    { __typename?: 'Player' }
    & PlayerFieldsFragment
  )> }
);

export type UpdateTrackByIdMutationVariables = Exact<{
  id: Scalars['MongoID'];
  record: UpdateByIdTrackInput;
}>;


export type UpdateTrackByIdMutation = (
  { __typename?: 'Mutation' }
  & { trackUpdateById?: Maybe<(
    { __typename?: 'UpdateByIdTrackPayload' }
    & Pick<UpdateByIdTrackPayload, 'recordId'>
    & { error?: Maybe<(
      { __typename?: 'ValidationError' }
      & Pick<ValidationError, 'message'>
    ) | (
      { __typename?: 'MongoError' }
      & Pick<MongoError, 'message'>
    ) | (
      { __typename?: 'RuntimeError' }
      & Pick<RuntimeError, 'message'>
    )> }
  )> }
);

export type UpdatePlaylistByIdMutationVariables = Exact<{
  id: Scalars['MongoID'];
  record: UpdateByIdPlaylistInput;
}>;


export type UpdatePlaylistByIdMutation = (
  { __typename?: 'Mutation' }
  & { playlistUpdateById?: Maybe<(
    { __typename?: 'UpdateByIdPlaylistPayload' }
    & Pick<UpdateByIdPlaylistPayload, 'recordId'>
    & { error?: Maybe<(
      { __typename?: 'ValidationError' }
      & Pick<ValidationError, 'message'>
    ) | (
      { __typename?: 'MongoError' }
      & Pick<MongoError, 'message'>
    ) | (
      { __typename?: 'RuntimeError' }
      & Pick<RuntimeError, 'message'>
    )> }
  )> }
);

export type CreateSoundboardItemMutationVariables = Exact<{
  record: CreateOneSoundboardItemInput;
}>;


export type CreateSoundboardItemMutation = (
  { __typename?: 'Mutation' }
  & { soundboardItemCreateOne?: Maybe<(
    { __typename?: 'CreateOneSoundboardItemPayload' }
    & Pick<CreateOneSoundboardItemPayload, 'recordId'>
    & { error?: Maybe<(
      { __typename?: 'ValidationError' }
      & Pick<ValidationError, 'message'>
    ) | (
      { __typename?: 'MongoError' }
      & Pick<MongoError, 'message'>
    ) | (
      { __typename?: 'RuntimeError' }
      & Pick<RuntimeError, 'message'>
    )> }
  )> }
);

export type UpdateSoundboardItemByIdMutationVariables = Exact<{
  id: Scalars['MongoID'];
  record: UpdateByIdSoundboardItemInput;
}>;


export type UpdateSoundboardItemByIdMutation = (
  { __typename?: 'Mutation' }
  & { soundboardItemUpdateById?: Maybe<(
    { __typename?: 'UpdateByIdSoundboardItemPayload' }
    & Pick<UpdateByIdSoundboardItemPayload, 'recordId'>
    & { error?: Maybe<(
      { __typename?: 'ValidationError' }
      & Pick<ValidationError, 'message'>
    ) | (
      { __typename?: 'MongoError' }
      & Pick<MongoError, 'message'>
    ) | (
      { __typename?: 'RuntimeError' }
      & Pick<RuntimeError, 'message'>
    )> }
  )> }
);

export type RemoveSoundboardItemByIdMutationVariables = Exact<{
  id: Scalars['MongoID'];
}>;


export type RemoveSoundboardItemByIdMutation = (
  { __typename?: 'Mutation' }
  & { soundboardItemRemoveById?: Maybe<(
    { __typename?: 'RemoveByIdSoundboardItemPayload' }
    & Pick<RemoveByIdSoundboardItemPayload, 'recordId'>
    & { error?: Maybe<(
      { __typename?: 'ValidationError' }
      & Pick<ValidationError, 'message'>
    ) | (
      { __typename?: 'MongoError' }
      & Pick<MongoError, 'message'>
    ) | (
      { __typename?: 'RuntimeError' }
      & Pick<RuntimeError, 'message'>
    )> }
  )> }
);

export type UpdateQueueMutationVariables = Exact<{
  guild: Scalars['String'];
  queueIDs: Array<Scalars['String']> | Scalars['String'];
}>;


export type UpdateQueueMutation = (
  { __typename?: 'Mutation' }
  & { updateQueue?: Maybe<(
    { __typename?: 'Player' }
    & Pick<Player, 'queueIDs'>
  )> }
);

export type PlaylistFieldsWithoutTracksFragment = (
  { __typename?: 'Playlist' }
  & Pick<Playlist, '_id' | 'identifier' | 'name' | 'owner' | 'source' | 'uri' | 'url'>
  & { favourite?: Maybe<Array<Maybe<(
    { __typename?: 'PlaylistFavourite' }
    & Pick<PlaylistFavourite, 'guild' | 'favourite'>
  )>>>, lastTouchedAt?: Maybe<Array<Maybe<(
    { __typename?: 'PlaylistLastTouchedAt' }
    & Pick<PlaylistLastTouchedAt, 'guild' | 'date'>
  )>>>, thumbnail?: Maybe<(
    { __typename?: 'PlaylistThumbnail' }
    & Pick<PlaylistThumbnail, 'small' | 'medium' | 'large'>
  )> }
);

export type PlaylistFieldsFragment = (
  { __typename?: 'Playlist' }
  & Pick<Playlist, '_id' | 'identifier' | 'name' | 'owner' | 'source' | 'tracks' | 'uri' | 'url'>
  & { favourite?: Maybe<Array<Maybe<(
    { __typename?: 'PlaylistFavourite' }
    & Pick<PlaylistFavourite, 'guild' | 'favourite'>
  )>>>, lastTouchedAt?: Maybe<Array<Maybe<(
    { __typename?: 'PlaylistLastTouchedAt' }
    & Pick<PlaylistLastTouchedAt, 'guild' | 'date'>
  )>>>, thumbnail?: Maybe<(
    { __typename?: 'PlaylistThumbnail' }
    & Pick<PlaylistThumbnail, 'small' | 'medium' | 'large'>
  )> }
);

export type TrackFieldsFragment = (
  { __typename?: 'Track' }
  & Pick<Track, '_id' | 'artists' | 'title' | 'source' | 'url'>
  & { favourite?: Maybe<Array<Maybe<(
    { __typename?: 'TrackFavourite' }
    & Pick<TrackFavourite, 'guild' | 'favourite'>
  )>>>, lastTouchedAt?: Maybe<Array<Maybe<(
    { __typename?: 'TrackLastTouchedAt' }
    & Pick<TrackLastTouchedAt, 'guild' | 'date'>
  )>>>, thumbnail?: Maybe<(
    { __typename?: 'TrackThumbnail' }
    & Pick<TrackThumbnail, 'small' | 'medium' | 'large'>
  )> }
);

export type SoundboardItemFieldsFragment = (
  { __typename?: 'SoundboardItem' }
  & Pick<SoundboardItem, '_id' | 'guild' | 'name' | 'source'>
);

export type PlayerFieldsFragment = (
  { __typename?: 'Player' }
  & Pick<Player, 'available' | 'currentTrackID' | 'loopState' | 'paused' | 'queueIDs' | 'volume'>
);

export const PlaylistFieldsWithoutTracksFragmentDoc = gql`
    fragment playlistFieldsWithoutTracks on Playlist {
  _id
  identifier
  favourite {
    guild
    favourite
  }
  lastTouchedAt {
    guild
    date
  }
  name
  owner
  source
  thumbnail {
    small
    medium
    large
  }
  uri
  url
}
    `;
export const PlaylistFieldsFragmentDoc = gql`
    fragment playlistFields on Playlist {
  _id
  identifier
  favourite {
    guild
    favourite
  }
  lastTouchedAt {
    guild
    date
  }
  name
  owner
  source
  tracks
  thumbnail {
    small
    medium
    large
  }
  uri
  url
}
    `;
export const TrackFieldsFragmentDoc = gql`
    fragment trackFields on Track {
  _id
  artists
  favourite {
    guild
    favourite
  }
  lastTouchedAt {
    guild
    date
  }
  title
  source
  thumbnail {
    small
    medium
    large
  }
  url
}
    `;
export const SoundboardItemFieldsFragmentDoc = gql`
    fragment soundboardItemFields on SoundboardItem {
  _id
  guild
  name
  source
}
    `;
export const PlayerFieldsFragmentDoc = gql`
    fragment playerFields on Player {
  available
  currentTrackID
  loopState
  paused
  queueIDs
  volume
}
    `;
export const GetFavouritesDocument = gql`
    query GetFavourites($guild: String!) {
  playlistMany(filter: {favourite: {guild: $guild, favourite: true}}) {
    ...playlistFieldsWithoutTracks
  }
  trackMany(filter: {favourite: {guild: $guild, favourite: true}}) {
    ...trackFields
  }
}
    ${PlaylistFieldsWithoutTracksFragmentDoc}
${TrackFieldsFragmentDoc}`;

/**
 * __useGetFavouritesQuery__
 *
 * To run a query within a React component, call `useGetFavouritesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFavouritesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFavouritesQuery({
 *   variables: {
 *      guild: // value for 'guild'
 *   },
 * });
 */
export function useGetFavouritesQuery(baseOptions: Apollo.QueryHookOptions<GetFavouritesQuery, GetFavouritesQueryVariables>) {
        return Apollo.useQuery<GetFavouritesQuery, GetFavouritesQueryVariables>(GetFavouritesDocument, baseOptions);
      }
export function useGetFavouritesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFavouritesQuery, GetFavouritesQueryVariables>) {
          return Apollo.useLazyQuery<GetFavouritesQuery, GetFavouritesQueryVariables>(GetFavouritesDocument, baseOptions);
        }
export type GetFavouritesQueryHookResult = ReturnType<typeof useGetFavouritesQuery>;
export type GetFavouritesLazyQueryHookResult = ReturnType<typeof useGetFavouritesLazyQuery>;
export type GetFavouritesQueryResult = Apollo.QueryResult<GetFavouritesQuery, GetFavouritesQueryVariables>;
export const GetRecentsDocument = gql`
    query GetRecents($guild: String!) {
  playlistRecents(guild: $guild, limit: 20) {
    ...playlistFieldsWithoutTracks
  }
  trackRecents(guild: $guild, limit: 20) {
    ...trackFields
  }
}
    ${PlaylistFieldsWithoutTracksFragmentDoc}
${TrackFieldsFragmentDoc}`;

/**
 * __useGetRecentsQuery__
 *
 * To run a query within a React component, call `useGetRecentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecentsQuery({
 *   variables: {
 *      guild: // value for 'guild'
 *   },
 * });
 */
export function useGetRecentsQuery(baseOptions: Apollo.QueryHookOptions<GetRecentsQuery, GetRecentsQueryVariables>) {
        return Apollo.useQuery<GetRecentsQuery, GetRecentsQueryVariables>(GetRecentsDocument, baseOptions);
      }
export function useGetRecentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecentsQuery, GetRecentsQueryVariables>) {
          return Apollo.useLazyQuery<GetRecentsQuery, GetRecentsQueryVariables>(GetRecentsDocument, baseOptions);
        }
export type GetRecentsQueryHookResult = ReturnType<typeof useGetRecentsQuery>;
export type GetRecentsLazyQueryHookResult = ReturnType<typeof useGetRecentsLazyQuery>;
export type GetRecentsQueryResult = Apollo.QueryResult<GetRecentsQuery, GetRecentsQueryVariables>;
export const GetSoundboardItemsDocument = gql`
    query GetSoundboardItems($guild: String!) {
  soundboardItemMany(filter: {guild: $guild}) {
    ...soundboardItemFields
  }
}
    ${SoundboardItemFieldsFragmentDoc}`;

/**
 * __useGetSoundboardItemsQuery__
 *
 * To run a query within a React component, call `useGetSoundboardItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSoundboardItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSoundboardItemsQuery({
 *   variables: {
 *      guild: // value for 'guild'
 *   },
 * });
 */
export function useGetSoundboardItemsQuery(baseOptions: Apollo.QueryHookOptions<GetSoundboardItemsQuery, GetSoundboardItemsQueryVariables>) {
        return Apollo.useQuery<GetSoundboardItemsQuery, GetSoundboardItemsQueryVariables>(GetSoundboardItemsDocument, baseOptions);
      }
export function useGetSoundboardItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSoundboardItemsQuery, GetSoundboardItemsQueryVariables>) {
          return Apollo.useLazyQuery<GetSoundboardItemsQuery, GetSoundboardItemsQueryVariables>(GetSoundboardItemsDocument, baseOptions);
        }
export type GetSoundboardItemsQueryHookResult = ReturnType<typeof useGetSoundboardItemsQuery>;
export type GetSoundboardItemsLazyQueryHookResult = ReturnType<typeof useGetSoundboardItemsLazyQuery>;
export type GetSoundboardItemsQueryResult = Apollo.QueryResult<GetSoundboardItemsQuery, GetSoundboardItemsQueryVariables>;
export const GetPlaylistByIdDocument = gql`
    query GetPlaylistByID($id: MongoID!) {
  playlistById(_id: $id) {
    ...playlistFields
  }
}
    ${PlaylistFieldsFragmentDoc}`;

/**
 * __useGetPlaylistByIdQuery__
 *
 * To run a query within a React component, call `useGetPlaylistByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlaylistByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlaylistByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPlaylistByIdQuery(baseOptions: Apollo.QueryHookOptions<GetPlaylistByIdQuery, GetPlaylistByIdQueryVariables>) {
        return Apollo.useQuery<GetPlaylistByIdQuery, GetPlaylistByIdQueryVariables>(GetPlaylistByIdDocument, baseOptions);
      }
export function useGetPlaylistByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPlaylistByIdQuery, GetPlaylistByIdQueryVariables>) {
          return Apollo.useLazyQuery<GetPlaylistByIdQuery, GetPlaylistByIdQueryVariables>(GetPlaylistByIdDocument, baseOptions);
        }
export type GetPlaylistByIdQueryHookResult = ReturnType<typeof useGetPlaylistByIdQuery>;
export type GetPlaylistByIdLazyQueryHookResult = ReturnType<typeof useGetPlaylistByIdLazyQuery>;
export type GetPlaylistByIdQueryResult = Apollo.QueryResult<GetPlaylistByIdQuery, GetPlaylistByIdQueryVariables>;
export const GetPlaylistByIdUpdatedDocument = gql`
    query GetPlaylistByIDUpdated($id: MongoID!) {
  playlistByIdUpdated(_id: $id) {
    ...playlistFields
  }
}
    ${PlaylistFieldsFragmentDoc}`;

/**
 * __useGetPlaylistByIdUpdatedQuery__
 *
 * To run a query within a React component, call `useGetPlaylistByIdUpdatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlaylistByIdUpdatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlaylistByIdUpdatedQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPlaylistByIdUpdatedQuery(baseOptions: Apollo.QueryHookOptions<GetPlaylistByIdUpdatedQuery, GetPlaylistByIdUpdatedQueryVariables>) {
        return Apollo.useQuery<GetPlaylistByIdUpdatedQuery, GetPlaylistByIdUpdatedQueryVariables>(GetPlaylistByIdUpdatedDocument, baseOptions);
      }
export function useGetPlaylistByIdUpdatedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPlaylistByIdUpdatedQuery, GetPlaylistByIdUpdatedQueryVariables>) {
          return Apollo.useLazyQuery<GetPlaylistByIdUpdatedQuery, GetPlaylistByIdUpdatedQueryVariables>(GetPlaylistByIdUpdatedDocument, baseOptions);
        }
export type GetPlaylistByIdUpdatedQueryHookResult = ReturnType<typeof useGetPlaylistByIdUpdatedQuery>;
export type GetPlaylistByIdUpdatedLazyQueryHookResult = ReturnType<typeof useGetPlaylistByIdUpdatedLazyQuery>;
export type GetPlaylistByIdUpdatedQueryResult = Apollo.QueryResult<GetPlaylistByIdUpdatedQuery, GetPlaylistByIdUpdatedQueryVariables>;
export const GetTracksByIdsDocument = gql`
    query GetTracksByIds($ids: [MongoID!]!, $limit: Int) {
  trackByIds(_ids: $ids, limit: $limit) {
    ...trackFields
  }
}
    ${TrackFieldsFragmentDoc}`;

/**
 * __useGetTracksByIdsQuery__
 *
 * To run a query within a React component, call `useGetTracksByIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTracksByIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTracksByIdsQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetTracksByIdsQuery(baseOptions: Apollo.QueryHookOptions<GetTracksByIdsQuery, GetTracksByIdsQueryVariables>) {
        return Apollo.useQuery<GetTracksByIdsQuery, GetTracksByIdsQueryVariables>(GetTracksByIdsDocument, baseOptions);
      }
export function useGetTracksByIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTracksByIdsQuery, GetTracksByIdsQueryVariables>) {
          return Apollo.useLazyQuery<GetTracksByIdsQuery, GetTracksByIdsQueryVariables>(GetTracksByIdsDocument, baseOptions);
        }
export type GetTracksByIdsQueryHookResult = ReturnType<typeof useGetTracksByIdsQuery>;
export type GetTracksByIdsLazyQueryHookResult = ReturnType<typeof useGetTracksByIdsLazyQuery>;
export type GetTracksByIdsQueryResult = Apollo.QueryResult<GetTracksByIdsQuery, GetTracksByIdsQueryVariables>;
export const GetTrackByIdDocument = gql`
    query GetTrackById($id: MongoID!) {
  trackById(_id: $id) {
    ...trackFields
  }
}
    ${TrackFieldsFragmentDoc}`;

/**
 * __useGetTrackByIdQuery__
 *
 * To run a query within a React component, call `useGetTrackByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrackByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrackByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTrackByIdQuery(baseOptions: Apollo.QueryHookOptions<GetTrackByIdQuery, GetTrackByIdQueryVariables>) {
        return Apollo.useQuery<GetTrackByIdQuery, GetTrackByIdQueryVariables>(GetTrackByIdDocument, baseOptions);
      }
export function useGetTrackByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTrackByIdQuery, GetTrackByIdQueryVariables>) {
          return Apollo.useLazyQuery<GetTrackByIdQuery, GetTrackByIdQueryVariables>(GetTrackByIdDocument, baseOptions);
        }
export type GetTrackByIdQueryHookResult = ReturnType<typeof useGetTrackByIdQuery>;
export type GetTrackByIdLazyQueryHookResult = ReturnType<typeof useGetTrackByIdLazyQuery>;
export type GetTrackByIdQueryResult = Apollo.QueryResult<GetTrackByIdQuery, GetTrackByIdQueryVariables>;
export const GetGuildsDocument = gql`
    query GetGuilds {
  getGuilds {
    id
    name
    members {
      id
      name
    }
  }
}
    `;

/**
 * __useGetGuildsQuery__
 *
 * To run a query within a React component, call `useGetGuildsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGuildsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGuildsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGuildsQuery(baseOptions?: Apollo.QueryHookOptions<GetGuildsQuery, GetGuildsQueryVariables>) {
        return Apollo.useQuery<GetGuildsQuery, GetGuildsQueryVariables>(GetGuildsDocument, baseOptions);
      }
export function useGetGuildsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGuildsQuery, GetGuildsQueryVariables>) {
          return Apollo.useLazyQuery<GetGuildsQuery, GetGuildsQueryVariables>(GetGuildsDocument, baseOptions);
        }
export type GetGuildsQueryHookResult = ReturnType<typeof useGetGuildsQuery>;
export type GetGuildsLazyQueryHookResult = ReturnType<typeof useGetGuildsLazyQuery>;
export type GetGuildsQueryResult = Apollo.QueryResult<GetGuildsQuery, GetGuildsQueryVariables>;
export const GetPlayerDocument = gql`
    query GetPlayer($id: String!) {
  getPlayer(guild: $id) {
    ...playerFields
  }
}
    ${PlayerFieldsFragmentDoc}`;

/**
 * __useGetPlayerQuery__
 *
 * To run a query within a React component, call `useGetPlayerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlayerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlayerQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPlayerQuery(baseOptions: Apollo.QueryHookOptions<GetPlayerQuery, GetPlayerQueryVariables>) {
        return Apollo.useQuery<GetPlayerQuery, GetPlayerQueryVariables>(GetPlayerDocument, baseOptions);
      }
export function useGetPlayerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPlayerQuery, GetPlayerQueryVariables>) {
          return Apollo.useLazyQuery<GetPlayerQuery, GetPlayerQueryVariables>(GetPlayerDocument, baseOptions);
        }
export type GetPlayerQueryHookResult = ReturnType<typeof useGetPlayerQuery>;
export type GetPlayerLazyQueryHookResult = ReturnType<typeof useGetPlayerLazyQuery>;
export type GetPlayerQueryResult = Apollo.QueryResult<GetPlayerQuery, GetPlayerQueryVariables>;
export const UpdateTrackByIdDocument = gql`
    mutation UpdateTrackById($id: MongoID!, $record: UpdateByIdTrackInput!) {
  trackUpdateById(_id: $id, record: $record) {
    recordId
    error {
      message
    }
  }
}
    `;
export type UpdateTrackByIdMutationFn = Apollo.MutationFunction<UpdateTrackByIdMutation, UpdateTrackByIdMutationVariables>;

/**
 * __useUpdateTrackByIdMutation__
 *
 * To run a mutation, you first call `useUpdateTrackByIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTrackByIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrackByIdMutation, { data, loading, error }] = useUpdateTrackByIdMutation({
 *   variables: {
 *      id: // value for 'id'
 *      record: // value for 'record'
 *   },
 * });
 */
export function useUpdateTrackByIdMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTrackByIdMutation, UpdateTrackByIdMutationVariables>) {
        return Apollo.useMutation<UpdateTrackByIdMutation, UpdateTrackByIdMutationVariables>(UpdateTrackByIdDocument, baseOptions);
      }
export type UpdateTrackByIdMutationHookResult = ReturnType<typeof useUpdateTrackByIdMutation>;
export type UpdateTrackByIdMutationResult = Apollo.MutationResult<UpdateTrackByIdMutation>;
export type UpdateTrackByIdMutationOptions = Apollo.BaseMutationOptions<UpdateTrackByIdMutation, UpdateTrackByIdMutationVariables>;
export const UpdatePlaylistByIdDocument = gql`
    mutation UpdatePlaylistById($id: MongoID!, $record: UpdateByIdPlaylistInput!) {
  playlistUpdateById(_id: $id, record: $record) {
    recordId
    error {
      message
    }
  }
}
    `;
export type UpdatePlaylistByIdMutationFn = Apollo.MutationFunction<UpdatePlaylistByIdMutation, UpdatePlaylistByIdMutationVariables>;

/**
 * __useUpdatePlaylistByIdMutation__
 *
 * To run a mutation, you first call `useUpdatePlaylistByIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePlaylistByIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePlaylistByIdMutation, { data, loading, error }] = useUpdatePlaylistByIdMutation({
 *   variables: {
 *      id: // value for 'id'
 *      record: // value for 'record'
 *   },
 * });
 */
export function useUpdatePlaylistByIdMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePlaylistByIdMutation, UpdatePlaylistByIdMutationVariables>) {
        return Apollo.useMutation<UpdatePlaylistByIdMutation, UpdatePlaylistByIdMutationVariables>(UpdatePlaylistByIdDocument, baseOptions);
      }
export type UpdatePlaylistByIdMutationHookResult = ReturnType<typeof useUpdatePlaylistByIdMutation>;
export type UpdatePlaylistByIdMutationResult = Apollo.MutationResult<UpdatePlaylistByIdMutation>;
export type UpdatePlaylistByIdMutationOptions = Apollo.BaseMutationOptions<UpdatePlaylistByIdMutation, UpdatePlaylistByIdMutationVariables>;
export const CreateSoundboardItemDocument = gql`
    mutation CreateSoundboardItem($record: CreateOneSoundboardItemInput!) {
  soundboardItemCreateOne(record: $record) {
    recordId
    error {
      message
    }
  }
}
    `;
export type CreateSoundboardItemMutationFn = Apollo.MutationFunction<CreateSoundboardItemMutation, CreateSoundboardItemMutationVariables>;

/**
 * __useCreateSoundboardItemMutation__
 *
 * To run a mutation, you first call `useCreateSoundboardItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSoundboardItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSoundboardItemMutation, { data, loading, error }] = useCreateSoundboardItemMutation({
 *   variables: {
 *      record: // value for 'record'
 *   },
 * });
 */
export function useCreateSoundboardItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateSoundboardItemMutation, CreateSoundboardItemMutationVariables>) {
        return Apollo.useMutation<CreateSoundboardItemMutation, CreateSoundboardItemMutationVariables>(CreateSoundboardItemDocument, baseOptions);
      }
export type CreateSoundboardItemMutationHookResult = ReturnType<typeof useCreateSoundboardItemMutation>;
export type CreateSoundboardItemMutationResult = Apollo.MutationResult<CreateSoundboardItemMutation>;
export type CreateSoundboardItemMutationOptions = Apollo.BaseMutationOptions<CreateSoundboardItemMutation, CreateSoundboardItemMutationVariables>;
export const UpdateSoundboardItemByIdDocument = gql`
    mutation UpdateSoundboardItemById($id: MongoID!, $record: UpdateByIdSoundboardItemInput!) {
  soundboardItemUpdateById(_id: $id, record: $record) {
    recordId
    error {
      message
    }
  }
}
    `;
export type UpdateSoundboardItemByIdMutationFn = Apollo.MutationFunction<UpdateSoundboardItemByIdMutation, UpdateSoundboardItemByIdMutationVariables>;

/**
 * __useUpdateSoundboardItemByIdMutation__
 *
 * To run a mutation, you first call `useUpdateSoundboardItemByIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSoundboardItemByIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSoundboardItemByIdMutation, { data, loading, error }] = useUpdateSoundboardItemByIdMutation({
 *   variables: {
 *      id: // value for 'id'
 *      record: // value for 'record'
 *   },
 * });
 */
export function useUpdateSoundboardItemByIdMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSoundboardItemByIdMutation, UpdateSoundboardItemByIdMutationVariables>) {
        return Apollo.useMutation<UpdateSoundboardItemByIdMutation, UpdateSoundboardItemByIdMutationVariables>(UpdateSoundboardItemByIdDocument, baseOptions);
      }
export type UpdateSoundboardItemByIdMutationHookResult = ReturnType<typeof useUpdateSoundboardItemByIdMutation>;
export type UpdateSoundboardItemByIdMutationResult = Apollo.MutationResult<UpdateSoundboardItemByIdMutation>;
export type UpdateSoundboardItemByIdMutationOptions = Apollo.BaseMutationOptions<UpdateSoundboardItemByIdMutation, UpdateSoundboardItemByIdMutationVariables>;
export const RemoveSoundboardItemByIdDocument = gql`
    mutation RemoveSoundboardItemById($id: MongoID!) {
  soundboardItemRemoveById(_id: $id) {
    recordId
    error {
      message
    }
  }
}
    `;
export type RemoveSoundboardItemByIdMutationFn = Apollo.MutationFunction<RemoveSoundboardItemByIdMutation, RemoveSoundboardItemByIdMutationVariables>;

/**
 * __useRemoveSoundboardItemByIdMutation__
 *
 * To run a mutation, you first call `useRemoveSoundboardItemByIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveSoundboardItemByIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeSoundboardItemByIdMutation, { data, loading, error }] = useRemoveSoundboardItemByIdMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveSoundboardItemByIdMutation(baseOptions?: Apollo.MutationHookOptions<RemoveSoundboardItemByIdMutation, RemoveSoundboardItemByIdMutationVariables>) {
        return Apollo.useMutation<RemoveSoundboardItemByIdMutation, RemoveSoundboardItemByIdMutationVariables>(RemoveSoundboardItemByIdDocument, baseOptions);
      }
export type RemoveSoundboardItemByIdMutationHookResult = ReturnType<typeof useRemoveSoundboardItemByIdMutation>;
export type RemoveSoundboardItemByIdMutationResult = Apollo.MutationResult<RemoveSoundboardItemByIdMutation>;
export type RemoveSoundboardItemByIdMutationOptions = Apollo.BaseMutationOptions<RemoveSoundboardItemByIdMutation, RemoveSoundboardItemByIdMutationVariables>;
export const UpdateQueueDocument = gql`
    mutation UpdateQueue($guild: String!, $queueIDs: [String!]!) {
  updateQueue(guild: $guild, queueIDs: $queueIDs) {
    queueIDs
  }
}
    `;
export type UpdateQueueMutationFn = Apollo.MutationFunction<UpdateQueueMutation, UpdateQueueMutationVariables>;

/**
 * __useUpdateQueueMutation__
 *
 * To run a mutation, you first call `useUpdateQueueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateQueueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateQueueMutation, { data, loading, error }] = useUpdateQueueMutation({
 *   variables: {
 *      guild: // value for 'guild'
 *      queueIDs: // value for 'queueIDs'
 *   },
 * });
 */
export function useUpdateQueueMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQueueMutation, UpdateQueueMutationVariables>) {
        return Apollo.useMutation<UpdateQueueMutation, UpdateQueueMutationVariables>(UpdateQueueDocument, baseOptions);
      }
export type UpdateQueueMutationHookResult = ReturnType<typeof useUpdateQueueMutation>;
export type UpdateQueueMutationResult = Apollo.MutationResult<UpdateQueueMutation>;
export type UpdateQueueMutationOptions = Apollo.BaseMutationOptions<UpdateQueueMutation, UpdateQueueMutationVariables>;