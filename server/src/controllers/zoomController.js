import axios from "axios";
import { getAccessToken } from "../utils/tokenService.js";


const token = "eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6ImIxZGQ5YzhiLWNkMjItNGFjMi1iZjk4LTRlMDY5N2MwMmI5OCJ9.eyJ2ZXIiOjksImF1aWQiOiI4OWU1MzcyMmRlM2FmOWFkOTExYmI4YTk1ZTQ1OWYzYSIsImNvZGUiOiJQSkFYQTR1c3Q3dFQtS1hkdF9BUUh1MVo1SzRaUkZXU1EiLCJpc3MiOiJ6bTpjaWQ6ZUllQ2JubVRUZ0tzT2JQbVp2ZXd0USIsImdubyI6MCwidHlwZSI6MCwidGlkIjowLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJOT0xpU3lteVEzeTE3STd4WDZLOXhnIiwibmJmIjoxNzEyNDUzNjk4LCJleHAiOjE3MTI0NTcyOTgsImlhdCI6MTcxMjQ1MzY5OCwiYWlkIjoicWFJWUxzVldUWG1aeG91Zm9HWG9tUSJ9.dUXCuD4hjRYDoHxQSetM3LUhmEa9UMYG8demnJBrA-EW1TvGj-8MPFbYDtNvn4PWNAV7SDByJQotIMrDZldhPA"
class ZoomController{
    
    async getMeetings(){
      try {
          const response = await axios.get('https://api.zoom.us/v2/users/me/meetings',{
              headers:{
                  'Authorization': `Bearer ${token}`
              }
          });
          const data = response.data;
          return data;
      } catch (error) {
          console.log('Error: ',error)
      }
    }
    
    // async createMeeting(topic, start_time, type, duration, timezone, agenda){
    //   try {
    //       const response = await axios.post('https://api.zoom.us/v2/users/me/meetings',{
    //           topic,
    //           type,
    //           start_time,
    //           duration,
    //           timezone,
    //           agenda,
    //           settings:{
    //               host_video:true,
    //               participant_video:true,
    //               join_before_host:false,
    //               mute_upon_entry: true,
    //               watermark:false,
    //               use_pmi:false,
    //               approval_type:0,
    //               audio:'both',
    //               auto_recording:'none'
    //           }
    //       },{
    //           headers:{
    //               'Authorization': `Bearer ${token}`
    //           }
    //       });
  
    //       const body = response.data;
    //       return body;
  
    //   } catch (error) {
    //       console.log("Error: ", error)
    //   }
    // }
    async createMeeting(topic, start_time, type, duration, timezone, agenda) {
        try {
            const accessToken = await getAccessToken(); 
            const formattedStartTime = new Date(start_time).toISOString();
            const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
                topic,
                type,
                start_time:formattedStartTime,
                duration,
                timezone,
                agenda,
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: false,
                    mute_upon_entry: true,
                    watermark: false,
                    use_pmi: false,
                    approval_type: 0,
                    audio: 'both',
                    auto_recording: 'none'
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            const body = response.data;
            return body;
    
        } catch (error) {
            console.log("Error: ", error);
        }
    }
}
export default new ZoomController();