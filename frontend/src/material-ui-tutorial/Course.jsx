import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";

function Course(props) {
  return (
    <div>
      {
        props.course ?
          <Card>
            <CardMedia
              style={{ height: 0, paddingTop: '56.25%' }}
              image={props.course.fields.courseImage.fields.file.url}
              title={props.course.fields.title}></CardMedia>
            <CardContent>
              <Typography gutterBottom variant="headline" component="h2">
                {props.course.fields.title}
              </Typography>
              <Typography></Typography>
            </CardContent>
          </Card>
          :
          ''
      }
    </div>
  );
}

export default Course;
