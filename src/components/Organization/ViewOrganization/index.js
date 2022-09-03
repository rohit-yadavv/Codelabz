import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useParams } from "react-router-dom";
import {
  clearOrgData,
  getOrgData,
  addFollower,
  removeFollower
} from "../../../store/actions";
import Banner from "../../ProfileBanner/Organization";
import List from "../../Topbar/Activity/ActivityList";
import { Container, makeStyles } from "@material-ui/core";
import About from "./About";
import Feeds from "./Feeds";
import Orgusers from "../OrgUsers/OrgUsers";
import Description from "../../UserDetails/Description";
import Spinner from "../../../helpers/spinner";
import ActivityList from "../../Topbar/Activity/ActivityList";

const useStyles = makeStyles(theme => ({
  acitvitylist: {
    padding: theme.spacing(1),
    backgroundColor: "#FFF",
    borderRadius: "4px"
    // boxShadow: theme.shadows[3]
  },
  feedGrid: {
    paddingTop: theme.spacing(5),
    width: "100%"
  },
  sideBar: {
    padding: theme.spacing(1)
  },
  grid: {
    width: "100%"
  },
  activity: {
    padding: theme.spacing(3)
  }
}));

const ViewOrganization = () => {
  const classes = useStyles();
  const { handle } = useParams();
  const [people, setPeople] = useState([]);
  const [orgFollowed, setOrgFollowed] = useState([]);
  const [Activity, setActivity] = useState(1);

  // Firebase Hooks
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const firestore = useFirestore();

  const db = firebase.firestore();
  const profileData = useSelector(({ firebase: { profile } }) => profile);
  // console.log(firebase);
  const CurrentOrg = useSelector(
    ({
      profile: {
        data: { organizations }
      },
      org: {
        general: { current }
      }
    }) => organizations[0]
  );

  console.log(CurrentOrg);
  // const [OrgData, setOrgData] = useState(CurrentOrg);

  console.log(profileData);
  const aboutfeedlist = [
    {
      id: 1,
      text: "About"
    },
    {
      id: 2,
      text: "Feeds"
    }
  ];

  const ContributersUsers = [
    {
      name: "Sarfraz Alam",
      designation: "GSoC 22'",
      avatar: {
        type: "image",
        value: "https://i.pravatar.cc/300"
      }
    },
    {
      name: "Jhanvi Thakkar",
      designation: "GSoC 22'",
      avatar: {
        type: "image",
        value: "https://i.pravatar.cc/300"
      }
    },
    {
      name: "Saksham Sharma",
      designation: "GSoC 22'",
      avatar: {
        type: "image",
        value: "https://i.pravatar.cc/300"
      }
    }
  ];

  useEffect(() => {
    const unsubscribe = db
      .collection("cl_org_general")
      .doc(handle)
      .onSnapshot(snap => {
        const data = snap.data();
        setPeople(data.followers);
      });

    return () => unsubscribe();
  }, [db, handle]);

  useEffect(() => {
    const unsubscribe = db
      .collection("cl_user")
      .doc(profileData.uid)
      .onSnapshot(snap => {
        const data = snap.data();
        setOrgFollowed(data.orgFollowed);
      });

    return () => unsubscribe();
  }, [db, profileData.uid]);

  const addfollower = (e, people, handle, orgFollowed) => {
    e.preventDefault();
    addFollower(
      profileData.handle,
      people,
      handle,
      orgFollowed,
      profileData.uid
    )(firestore, dispatch);
  };
  const removefollower = (e, val, people, handle, orgFollowed) => {
    e.preventDefault();
    removeFollower(
      val,
      people,
      handle,
      orgFollowed,
      profileData.uid
    )(firestore, dispatch);
  };

  const loading = useSelector(
    ({
      org: {
        data: { loading }
      }
    }) => loading
  );

  const currentOrgData = useSelector(
    ({
      org: {
        data: { data }
      }
    }) => data
  );

  // console.log(currentOrgData);

  const organizations = useSelector(
    ({
      firebase: {
        profile: { organizations }
      }
    }) => organizations
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getOrgData(handle, organizations)(firebase, firestore, dispatch);
    return () => {
      clearOrgData()(dispatch);
    };
  }, [handle, firebase, firestore, dispatch, organizations]);

  const checkAvailable = data => {
    return !!(data && data.length > 0);
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#F9F9F9",
        minHeight: "100vh"
      }}
    >
      {loading || !currentOrgData ? (
        <React.Fragment>
          <Spinner />
        </React.Fragment>
      ) : (
        <div>
          {currentOrgData && (
            <React.Fragment>
              <Banner
                bannerImage={CurrentOrg.org_image}
                contributors={402}
                feed={40}
                followers={402}
                name={CurrentOrg.org_name}
                profileImage={CurrentOrg.org_image}
                story="Think Different"
              />
              <Container
                maxWidth="xl"
                style={{
                  marginTop: "2rem"
                }}
              >
                <Grid
                  container
                  justifyContent="center"
                  className={classes.grid}
                >
                  <Grid
                    item
                    container
                    xs={12}
                    sm={12}
                    md={8}
                    className={classes.feedGrid}
                  >
                    <Grid item xs={12} container direction="column">
                      <Grid item xs={12}>
                        <ActivityList
                          acitvitylist={[
                            {
                              id: 1,
                              text: "About"
                            },
                            {
                              id: 2,
                              text: "Feeds"
                            }
                          ]}
                          toggle={item => {
                            setActivity(item.id);
                          }}
                          value={Activity}
                          classname={classes.acitvitylist}
                        />
                        {Activity === 1 && <About />}
                        {Activity === 2 && <Feeds />}
                      </Grid>
                    </Grid>
                  </Grid>
                  {Activity === 2 && (
                    <Grid
                      item
                      container
                      xs={12}
                      md={4}
                      justifyContent="flex-start"
                      direction="column"
                      spacing={5}
                      className={classes.activity}
                    >
                      <Grid item>
                        <Description
                          Heading={"Description"}
                          Content={CurrentOrg.org_description}
                        />
                      </Grid>
                      <Grid item>
                        <Description
                          Heading={"CodeLabz you may like"}
                          Content={CurrentOrg.org_description}
                        />
                      </Grid>
                      <Grid item>
                        <Orgusers
                          Users={ContributersUsers}
                          title={"Contributors"}
                        />
                      </Grid>
                      <Grid item>
                        <Orgusers
                          Users={ContributersUsers}
                          title={"Contributors"}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Container>
            </React.Fragment>
          )}
        </div>
      )}
      {currentOrgData === false && "No organization with the provided handle"}
    </div>
  );
};

export default ViewOrganization;
