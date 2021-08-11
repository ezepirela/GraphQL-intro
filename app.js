const express           = require('express'),
        app             =   express(),
        { graphqlHTTP }  = require('express-graphql'),
        { buildSchema } =  require('graphql'),
        { courses }            =   require('./data.json');

const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String!): [Course]
    }
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    }
    type Course {
        id: Int
        title: String
        author: String
        topic: String
        url: String
    }
`)
const updateCourseTopic = ({id, topic}) => {
    courses.map(course => {
        if(course.id === id){
            course.topic = topic;
            return course
        }
    })
    return courses.filter(course => course.id === id)[0];
};
const getCourse = (args) => {
    const id = args.id;
    return courses.filter(course => course.id == id)[0];
}
const getCourses = (args) => {
    if(args.topic){
        const topic = args.topic;
        return courses.filter(course => course.topic == topic);
    }else{
        return courses;
    }
    
}
const root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
}
app.use('/graphQL', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));


app.listen(3000, () => {
    console.log('app running')
})