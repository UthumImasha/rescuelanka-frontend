import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Decimal: { input: any; output: any; }
};

export type Mutation = {
  __typename?: 'Mutation';
  assignUserToOrganization: Scalars['Boolean']['output'];
  createOperationalCamp: OperationalCampGqlPayload;
  createOrganization: OrganizationGqlPayload;
  createRefugeeCamp: RefugeeCampGqlPayload;
  createReport: ReportGqlPayload;
  deleteOperationalCamp: Scalars['Boolean']['output'];
  deleteOrganization: Scalars['Boolean']['output'];
  deleteRefugeeCamp: Scalars['Boolean']['output'];
  endOrganizationAssignment: Scalars['Boolean']['output'];
  loginUser: TokenGqlPayload;
  registerUser: UserGqlPayload;
  updateCampOccupancy: RefugeeCampGqlPayload;
  updateOperationalCamp: OperationalCampGqlPayload;
  updateOperationalCampPersonnel: OperationalCampGqlPayload;
  updateOrganization: OrganizationGqlPayload;
  updateRefugeeCamp: RefugeeCampGqlPayload;
};


export type MutationAssignUserToOrganizationArgs = {
  inputData: UserOrganizationAssignmentInput;
};


export type MutationCreateOperationalCampArgs = {
  inputData: OperationalCampGqlInput;
};


export type MutationCreateOrganizationArgs = {
  inputData: OrganizationGqlInput;
};


export type MutationCreateRefugeeCampArgs = {
  inputData: RefugeeCampGqlInput;
};


export type MutationCreateReportArgs = {
  reportData: ReportGqlInput;
};


export type MutationDeleteOperationalCampArgs = {
  campId: Scalars['String']['input'];
};


export type MutationDeleteOrganizationArgs = {
  orgId: Scalars['String']['input'];
};


export type MutationDeleteRefugeeCampArgs = {
  campId: Scalars['String']['input'];
};


export type MutationEndOrganizationAssignmentArgs = {
  endDatetime?: InputMaybe<Scalars['DateTime']['input']>;
  orgId: Scalars['String']['input'];
  orgRole: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationLoginUserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRegisterUserArgs = {
  userData: UserCreateGqlInput;
};


export type MutationUpdateCampOccupancyArgs = {
  campId: Scalars['String']['input'];
  newOccupancy: Scalars['Int']['input'];
};


export type MutationUpdateOperationalCampArgs = {
  campId: Scalars['String']['input'];
  inputData: OperationalCampGqlUpdate;
};


export type MutationUpdateOperationalCampPersonnelArgs = {
  campId: Scalars['String']['input'];
  personnelCount: Scalars['Int']['input'];
};


export type MutationUpdateOrganizationArgs = {
  inputData: OrganizationGqlUpdate;
  orgId: Scalars['String']['input'];
};


export type MutationUpdateRefugeeCampArgs = {
  campId: Scalars['String']['input'];
  inputData: RefugeeCampGqlUpdate;
};

export type OperationalCampGqlInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  campType: Scalars['String']['input'];
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  personnelCount?: InputMaybe<Scalars['Int']['input']>;
  resourcesAvailable?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['DateTime']['input']>;
};

export type OperationalCampGqlPayload = {
  __typename?: 'OperationalCampGQLPayload';
  address?: Maybe<Scalars['String']['output']>;
  campType: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastUpdatedAt: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  personnelCount?: Maybe<Scalars['Int']['output']>;
  resourcesAvailable: Array<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type OperationalCampGqlUpdate = {
  address?: InputMaybe<Scalars['String']['input']>;
  campType?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  personnelCount?: InputMaybe<Scalars['Int']['input']>;
  resourcesAvailable?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['DateTime']['input']>;
};

export type OrganizationGqlInput = {
  name: Scalars['String']['input'];
  responsibleEventTypes: Array<Scalars['String']['input']>;
  services: Array<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['DateTime']['input']>;
};

export type OrganizationGqlPayload = {
  __typename?: 'OrganizationGQLPayload';
  address?: Maybe<Scalars['String']['output']>;
  contactEmail?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastUpdatedAt: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
};

export type OrganizationGqlUpdate = {
  name?: InputMaybe<Scalars['String']['input']>;
  responsibleEventTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  services?: InputMaybe<Array<Scalars['String']['input']>>;
  timestamp?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Query = {
  __typename?: 'Query';
  countEventOperationalCamps: Scalars['Int']['output'];
  countEventRefugeeCamps: Scalars['Int']['output'];
  countOrganizations: Scalars['Int']['output'];
  countUserOrgAssignments: Scalars['Int']['output'];
  findEventOperationalCamps: Array<OperationalCampGqlPayload>;
  findEventRefugeeCamps: Array<RefugeeCampGqlPayload>;
  findOrganizations: Array<OrganizationGqlPayload>;
  findUserOrgAssignments: Array<UserOrganizationAssignmentPayload>;
  getOperationalCampById?: Maybe<OperationalCampGqlPayload>;
  getOrganizationById?: Maybe<OrganizationGqlPayload>;
  getProfile: UserGqlPayload;
  getRefugeeCampById?: Maybe<RefugeeCampGqlPayload>;
  getReport?: Maybe<ReportGqlPayload>;
  hello: Scalars['String']['output'];
  listAllReports: Array<ReportGqlPayload>;
  listReportsForEvent: Array<ReportGqlPayload>;
};


export type QueryCountEventOperationalCampsArgs = {
  eventId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCountEventRefugeeCampsArgs = {
  eventId: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCountUserOrgAssignmentsArgs = {
  orgId: Scalars['String']['input'];
};


export type QueryFindEventOperationalCampsArgs = {
  eventId: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFindEventRefugeeCampsArgs = {
  eventId: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFindOrganizationsArgs = {
  limit?: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
};


export type QueryFindUserOrgAssignmentsArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetOperationalCampByIdArgs = {
  campId: Scalars['String']['input'];
};


export type QueryGetOrganizationByIdArgs = {
  orgId: Scalars['String']['input'];
};


export type QueryGetRefugeeCampByIdArgs = {
  campId: Scalars['String']['input'];
};


export type QueryGetReportArgs = {
  reportId: Scalars['String']['input'];
};


export type QueryListAllReportsArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type QueryListReportsForEventArgs = {
  eventId: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};

export type RefugeeCampGqlInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  capacity?: InputMaybe<Scalars['Int']['input']>;
  currentOccupancy?: InputMaybe<Scalars['Int']['input']>;
  facilities?: InputMaybe<Array<Scalars['String']['input']>>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  servicesOffered?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['DateTime']['input']>;
};

export type RefugeeCampGqlPayload = {
  __typename?: 'RefugeeCampGQLPayload';
  address?: Maybe<Scalars['String']['output']>;
  capacity?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['String']['output'];
  currentOccupancy?: Maybe<Scalars['Int']['output']>;
  facilities: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastUpdatedAt: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  servicesOffered: Array<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type RefugeeCampGqlUpdate = {
  address?: InputMaybe<Scalars['String']['input']>;
  capacity?: InputMaybe<Scalars['Int']['input']>;
  currentOccupancy?: InputMaybe<Scalars['Int']['input']>;
  facilities?: InputMaybe<Array<Scalars['String']['input']>>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  servicesOffered?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ReportGqlInput = {
  animalsPresent?: InputMaybe<Scalars['String']['input']>;
  clothingRequired?: InputMaybe<Scalars['Boolean']['input']>;
  description: Scalars['String']['input'];
  drinkingWaterAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  drinkingWaterDuration?: InputMaybe<Scalars['Int']['input']>;
  electricityAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  evacuationRequired?: InputMaybe<Scalars['Boolean']['input']>;
  eventDescription: Scalars['String']['input'];
  eventName: Scalars['String']['input'];
  foodAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  foodDuration?: InputMaybe<Scalars['Int']['input']>;
  injuriesOrMedicalConditions?: InputMaybe<Scalars['String']['input']>;
  isLocationAffected: Scalars['Boolean']['input'];
  medicalAidRequired?: InputMaybe<Scalars['Boolean']['input']>;
  reportAddress: Scalars['String']['input'];
  reportLatitude: Scalars['Float']['input'];
  reportLongitude: Scalars['Float']['input'];
  shelterRequired?: InputMaybe<Scalars['Boolean']['input']>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
  title: Scalars['String']['input'];
  type: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type ReportGqlPayload = {
  __typename?: 'ReportGQLPayload';
  animalsPresent?: Maybe<Scalars['String']['output']>;
  clothingRequired?: Maybe<Scalars['Boolean']['output']>;
  description: Scalars['String']['output'];
  drinkingWaterAvailable?: Maybe<Scalars['Boolean']['output']>;
  drinkingWaterDuration?: Maybe<Scalars['Int']['output']>;
  electricityAvailable?: Maybe<Scalars['Boolean']['output']>;
  evacuationRequired?: Maybe<Scalars['Boolean']['output']>;
  foodAvailable?: Maybe<Scalars['Boolean']['output']>;
  foodDuration?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  injuriesOrMedicalConditions?: Maybe<Scalars['String']['output']>;
  isLocationAffected: Scalars['Boolean']['output'];
  medicalAidRequired?: Maybe<Scalars['Boolean']['output']>;
  reportLatitude: Scalars['Float']['output'];
  reportLongitude: Scalars['Float']['output'];
  shelterRequired?: Maybe<Scalars['Boolean']['output']>;
  startTime?: Maybe<Scalars['DateTime']['output']>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type TokenGqlPayload = {
  __typename?: 'TokenGQLPayload';
  accessToken: Scalars['String']['output'];
  tokenType: TokenType;
};

export enum TokenType {
  Bearer = 'bearer'
}

export type UserCreateGqlInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  isActive: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  residentAddress: Scalars['String']['input'];
  residentLatitude: Scalars['Decimal']['input'];
  residentLongitude: Scalars['Decimal']['input'];
  role: UserRoleType;
  skills: Array<Scalars['String']['input']>;
};

export type UserGqlPayload = {
  __typename?: 'UserGQLPayload';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  residentAddress: Scalars['String']['output'];
  residentLatitude: Scalars['Decimal']['output'];
  residentLongitude: Scalars['Decimal']['output'];
  role: UserRoleType;
  skills: Array<Scalars['String']['output']>;
};

export type UserOrganizationAssignmentInput = {
  assignedDatetime?: InputMaybe<Scalars['DateTime']['input']>;
  assignmentEnded?: InputMaybe<Scalars['DateTime']['input']>;
  orgId: Scalars['String']['input'];
  orgRole: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type UserOrganizationAssignmentPayload = {
  __typename?: 'UserOrganizationAssignmentPayload';
  assignedDatetime?: Maybe<Scalars['DateTime']['output']>;
  assignmentEnded?: Maybe<Scalars['DateTime']['output']>;
  orgId: Scalars['String']['output'];
  orgRole: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export enum UserRoleType {
  Admin = 'admin',
  Guest = 'guest',
  User = 'user'
}

export type CreateReportMutationVariables = Exact<{
  reportData: ReportGqlInput;
}>;


export type CreateReportMutation = { __typename?: 'Mutation', createReport: { __typename?: 'ReportGQLPayload', id: string, type: string, title: string, description: string, userId: string, reportLatitude: number, reportLongitude: number, isLocationAffected: boolean, startTime?: any | null, injuriesOrMedicalConditions?: string | null, evacuationRequired?: boolean | null, shelterRequired?: boolean | null, medicalAidRequired?: boolean | null, clothingRequired?: boolean | null, electricityAvailable?: boolean | null, drinkingWaterAvailable?: boolean | null, drinkingWaterDuration?: number | null, foodAvailable?: boolean | null, foodDuration?: number | null, animalsPresent?: string | null } };

export type GetProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileQuery = { __typename?: 'Query', getProfile: { __typename?: 'UserGQLPayload', id: string, email: string, name: string, role: UserRoleType, phone: string, residentLatitude: any, residentLongitude: any, residentAddress: string, isActive: boolean, skills: Array<string>, createdAt?: any | null } };

export type LoginUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'TokenGQLPayload', accessToken: string, tokenType: TokenType } };

export type RegisterUserMutationVariables = Exact<{
  userData: UserCreateGqlInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'UserGQLPayload', id: string, name: string, role: UserRoleType, email: string, phone: string, residentLatitude: any, residentLongitude: any, residentAddress: string, isActive: boolean, createdAt?: any | null, skills: Array<string> } };


export const CreateReportDocument = gql`
    mutation CreateReport($reportData: ReportGQLInput!) {
  createReport(reportData: $reportData) {
    id
    type
    title
    description
    userId
    reportLatitude
    reportLongitude
    isLocationAffected
    startTime
    injuriesOrMedicalConditions
    evacuationRequired
    shelterRequired
    medicalAidRequired
    clothingRequired
    electricityAvailable
    drinkingWaterAvailable
    drinkingWaterDuration
    foodAvailable
    foodDuration
    animalsPresent
  }
}
    `;
export type CreateReportMutationFn = Apollo.MutationFunction<CreateReportMutation, CreateReportMutationVariables>;

/**
 * __useCreateReportMutation__
 *
 * To run a mutation, you first call `useCreateReportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReportMutation, { data, loading, error }] = useCreateReportMutation({
 *   variables: {
 *      reportData: // value for 'reportData'
 *   },
 * });
 */
export function useCreateReportMutation(baseOptions?: Apollo.MutationHookOptions<CreateReportMutation, CreateReportMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReportMutation, CreateReportMutationVariables>(CreateReportDocument, options);
      }
export type CreateReportMutationHookResult = ReturnType<typeof useCreateReportMutation>;
export type CreateReportMutationResult = Apollo.MutationResult<CreateReportMutation>;
export type CreateReportMutationOptions = Apollo.BaseMutationOptions<CreateReportMutation, CreateReportMutationVariables>;
export const GetProfileDocument = gql`
    query GetProfile {
  getProfile {
    id
    email
    name
    role
    phone
    residentLatitude
    residentLongitude
    residentAddress
    isActive
    skills
    createdAt
  }
}
    `;

/**
 * __useGetProfileQuery__
 *
 * To run a query within a React component, call `useGetProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProfileQuery(baseOptions?: Apollo.QueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
      }
export function useGetProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export function useGetProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
export type GetProfileLazyQueryHookResult = ReturnType<typeof useGetProfileLazyQuery>;
export type GetProfileSuspenseQueryHookResult = ReturnType<typeof useGetProfileSuspenseQuery>;
export type GetProfileQueryResult = Apollo.QueryResult<GetProfileQuery, GetProfileQueryVariables>;
export const LoginUserDocument = gql`
    mutation LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    accessToken
    tokenType
  }
}
    `;
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: Apollo.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, options);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const RegisterUserDocument = gql`
    mutation RegisterUser($userData: UserCreateGQLInput!) {
  registerUser(userData: $userData) {
    id
    name
    role
    email
    phone
    residentLatitude
    residentLongitude
    residentAddress
    isActive
    createdAt
    skills
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      userData: // value for 'userData'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;