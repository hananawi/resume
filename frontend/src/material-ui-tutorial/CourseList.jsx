import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import * as contentful from 'contentful';
import { useState } from 'react';

import Course from './Course.jsx';

const SPACE_ID = '6uwo16zyait9';
const ACCESS_TOKEN = 'spi4H3kbDvrh_Qatgmu4iUFYnxFLhEmy6DZDyEo_y-4';
const client = contentful.createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN
});

function useConstructor(callback) {
  const [flag, setFlag] = useState(false);
  if (flag) return;
  callback();
  setFlag(true);
}

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [searchString, setSearchString] = useState('');

  useConstructor(getCourses);

  function getCourses() {
    client.getEntries({
      content_type: 'materialUiTurorial',
      query: searchString
    }).then((res) => {
      console.log(res);
      setCourses(res.items);
    }).catch((error) => {
      console.log("Error occurred while fetching Entries")
      console.error(error)
    });
  }

  function onSearchInputChange(event) {
    console.log("Search changed ..." + event.target.value);
    if (event.target.value) {
      setSearchString(event.target.value);
    }
    getCourses();
  }

  return (
    <div>
      {
        courses ?
          <div>
            <TextField style={{ padding: '24px' }}
              id="searchInput"
              placeholder="Search for Courses"
              margin="normal"
              onChange={onSearchInputChange}></TextField>
            <Grid container spacing={8}
              style={{ padding: '24px' }}>
              {
                courses.map((course) => (
                  <Grid item xs={12} sm={6} lg={4}>
                    <Course course={course}></Course>
                  </Grid>
                ))
              }
            </Grid>
          </div>
          :
          'No courses found.'
      }
    </div>
  );
}

export default CourseList;
