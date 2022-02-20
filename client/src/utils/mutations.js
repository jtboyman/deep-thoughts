import {gql} from '@apollo/client';

//we import the gql tagged template literal functionality to create a GraphQL mutation called login. This will accept two variables, $email and $password, whose values we'll set up to be passed in as arguments when we integrate this with the login form page.
//In return, we expect the logged-in user's data and the token. With this token, we'll be able to perform other actions unique to the logged-in user.
export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

//This mutation is essentially the same as the LOGIN_USER one we created earlier, with the exception that we are now asking for an email address as well. The returning data should be the same, so we don't have to add the extra step for users to log in after signing up.
//Remember, the names and format that we use have to match what we set up on the server!
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

//add friend
export const ADD_FRIEND = gql`
  mutation addFriend($id: ID!) {
    addFriend(friendId: $id) {
      _id
      username
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;

//add thought
export const ADD_THOUGHT = gql`
  mutation addThought($thoughtText: String!) {
    addThought(thoughtText: $thoughtText) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
      }
    }
  }
`;

//add reaction
export const ADD_REACTION = gql`
  mutation addReaction($thoughtId: ID!, $reactionBody: String!) {
    addReaction(thoughtId: $thoughtId, reactionBody: $reactionBody) {
      _id
      reactionCount
      reactions {
        _id
        reactionBody
        createdAt
        username
      }
    }
  }
`;