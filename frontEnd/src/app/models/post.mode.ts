export interface Post {
    id: string,
    title: string,
    content: string,
    createdAt: string,
    media: string,
    numbersOfLikes:number
    user: {
      id: string,
      fullname:string,
      username: string,
      profileUrl:string,
    },
    comments: [],
    likes: []
    }