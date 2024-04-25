import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderText from "../components/headerText";
import { getCurrentTerm, getLocalGreeting } from "../utils/helpers";
import { images } from "../assets";
import SearchInput from "../components/home/searchInput";
import {
  MagnifyingGlassIcon,
  AdjustmentsVerticalIcon,
} from "react-native-heroicons/outline";
import { themeColors } from "../theme";
import TeacherItem from "../components/home/teacherItem";
import {
  areaFilters,
  institutionData,
  subjectFilters,
  teacherData,
} from "../assets/data/data";
import InstitutionItem from "../components/home/institutionItem";
import SectionHeader from "../components/home/sectionHeader";
import AreaFilter from "../components/home/areaFilter";
import SubjectFilter from "../components/home/subjectFilter";
import { useDispatch, useSelector } from "react-redux";
import { useGetCoursesQuery } from "../redux/api/CoursesApiSlice";
import NetInfo from "@react-native-community/netinfo";
import {
  initializecourseInfo,
  setCourse,
  setInitialCourseInfo,
} from "../redux/features/course/courseSlice";
import {
  useGetLearnerDetailsQuery,
  useGetTopSchoolsQuery,
  useLoginMutation,
  useLogoutMutation,
} from "../redux/api/learnersApiSlice";
import { RefreshControl } from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { logout, setCredentials } from "../redux/features/auth/authSlice";

const { avatar } = images;

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState(teacherData);
  const [institutions, setInstitutions] = useState(institutionData);
  const [SelectedSubject, setSelectedSubject] = useState();
  const [teachersFilterVisible, setTeachersFilterVisible] = useState(false);
  const [institutionsFilterVisible, setInstitutionsFilterVisible] =
    useState(false);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { courseInfo } = useSelector((state) => state.course);
  const [refreshing, setRefreshing] = React.useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const [logOutApi] = useLogoutMutation();
  const { data: topschools } = useGetTopSchoolsQuery();
  const currentTerm = getCurrentTerm();
  const { data, refetch, isFetching } = useGetCoursesQuery({
    class: userInfo?.class,
    term: currentTerm,
    school: userInfo?.schoolID._id,
  });
  const {
    data: user,
    isLoading,
    isError,
    refetch: refetchUser,
  } = useGetLearnerDetailsQuery(userInfo?._id);
  // const onRefresh = React.useCallback(() => {
  //   // setRefreshing(true);
  //   // setTimeout(() => {
  //   //   setRefreshing(false);
  //   // }, 2000);
  //   refetch();
  // }, []);

  const logoutHandler = async () => {
    try {
      const netInfo = await NetInfo.fetch();
      const isConnected = netInfo.isConnected;
      if (isConnected) {
        const result = await logOutApi(userInfo?._id);
        if (result?.error) {
          Alert.alert("Network request failed");
        }
        if (result.data?.status === "success") {
          await dispatch(logout());
          navigation.navigate("SignIn");
        }
      } else {
        Alert.alert("internet not available");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      if (user?.learner?.schoolID.isActivated === false) {
        logoutHandler();
      }
      refetch();
      refetchUser();
    }, [user])
  );

  useEffect(() => {
    const fetchData = async () => {
      // Check if there's an active network connection
      const netInfo = await NetInfo.fetch();
      const isConnected = netInfo.isConnected;

      try {
        // Check if there's an active network connection
        if (isConnected && data) {
          // If there's a network connection, query the database
          dispatch(setInitialCourseInfo(data));
          dispatch(setCourse(data));
          navigation.setParams({ refresh: false });
        } else if (!isConnected && !data) {
          // If there's no network connection, fetch data from AsyncStorage
          dispatch(initializecourseInfo());
          navigation.setParams({ refresh: false });
        }
        navigation.setParams({ refresh: false });
      } catch (error) {
        console.error("Error initializing course", error);
        navigation.setParams({ refresh: false });
      }
    };

    fetchData();
  }, [NetInfo, data, refetch]);
  /**
   * @description Function to toggle the teachers filter visibility
   */
  const toggleTeachersFilter = () => {
    setTeachersFilterVisible(!teachersFilterVisible);
  };

  /**
   * @description Function to toggle the institutions filter visibility
   */
  const toggleInstitutionsFilter = () => {
    setInstitutionsFilterVisible(!institutionsFilterVisible);
  };

  /**
   * @description handles search for teachers and institutions
   * @param {*} searchQuery
   */
  const handleSearchChange = (searchQuery) => {
    setSearchQuery(searchQuery);
    setTeachersFilterVisible(false);
    setInstitutionsFilterVisible(false);

    // set query to lowercase
    const lowerCaseQuery = searchQuery.toLowerCase();

    // Filter teachers based on the search query
    const filteredTeachers = teacherData?.filter((teacher) =>
      teacher.name.toLowerCase().includes(lowerCaseQuery)
    );
    setTeachers(filteredTeachers);

    // Filter institutions based on the search query
    const filteredInstitutions = institutionData?.filter((institution) =>
      institution.name.toLowerCase().includes(lowerCaseQuery)
    );
    setInstitutions(filteredInstitutions);
  };

  /**
   * @description Function to filter teachers based on the selected subject
   * @param {*} subject
   */
  const filterTeachersBySubject = (subject) => {
    setSelectedSubject(subject);

    // Filter the teachers based on the selected subject
    if (subject.toLowerCase() === "all subjects") {
      setTeachers(teacherData); // Show all teachers when 'All Subjects' is selected
    } else if (subject.toLowerCase() === "science for technology") {
      setTeachers(teacherData);
    } else {
      const filteredTeachers = teacherData.filter(
        (teacher) => teacher.subject.toLowerCase() === subject.toLowerCase()
      );
      setTeachers(filteredTeachers);
    }
  };

  return (
    <SafeAreaView className="bg-bgWhite px-7 pt-5 pb-[-35px] flex-1">
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        {/**============= Header Area =================== */}
        <View className="flex flex-row items-center justify-between">
          <View className="">
            {/** Get greeting based on current time */}
            <HeaderText text={getLocalGreeting()} />
            {userInfo ? (
              <Text className="font-exoSemibold font-semibold text-lg">
                {userInfo?.name}
              </Text>
            ) : null}
          </View>
          {/** ============= Profile image/avatar ============ */}
          <View className="bg-bgWhite shadow-xl rounded-xl">
            <Image source={avatar} style={{ height: 62, width: 62 }} />
          </View>
        </View>
        {/** ================ Search Input  ========================= */}
        <View className="flex flex-row items-center justify-between my-7">
          <View className="flex-1">
            <SearchInput
              placeholder={"Search"}
              // value={searchQuery}
              // onChange={handleSearchChange}
              Icon={MagnifyingGlassIcon}
            />
          </View>
          {/** ==================== Filter Icon ================================= */}
          <Pressable className="ml-3">
            <AdjustmentsVerticalIcon
              size={28}
              color={themeColors.darkGrayText}
            />
          </Pressable>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className=" h-full w-full"
        >
          {/** ========================= Teachers Section =========================== */}
          <View className="mt-2">
            <SectionHeader
              title={"Featured for you"}
              // onFilterPress={toggleTeachersFilter}
              tintColor={
                teachersFilterVisible
                  ? themeColors.bgPurple
                  : themeColors.lightGrayText
              }
            />

            {/**============== Teacher Filters ==================== */}
            {teachersFilterVisible ? (
              <View className="flex flex-col my-5 space-y-2">
                <AreaFilter filters={areaFilters} />
                <SubjectFilter
                  filters={subjectFilters}
                  onSubjectSelect={filterTeachersBySubject}
                />
              </View>
            ) : null}

            {/** ========================= Render List of Teachers =========================== */}

            {/* <FlatList
            data={courseInfo}
            horizontal={true}
            className="w-full py-4 bg-transparent"
            renderItem={({ item }) => <TeacherItem course={item} />}
            keyExtractor={(item, index) => item.name}
            showsHorizontalScrollIndicator={false}
          /> */}
            {courseInfo && courseInfo.length > 0 ? (
              <FlatList
                data={[...courseInfo]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 5)} // Create a new array using spread operator
                horizontal={true}
                className="w-full py-4 bg-transparent"
                renderItem={({ item }) => <TeacherItem course={item} />}
                keyExtractor={(item, index) => item?.name}
                showsHorizontalScrollIndicator={false}
              />
            ) : null}
          </View>

          {/** ========================= Institutions Section =========================== */}
          <View className="mt-2">
            <SectionHeader
              title={"Popular/Top Schools"}
              // onFilterPress={toggleInstitutionsFilter}
              // tintColor={
              //   institutionsFilterVisible
              //     ? themeColors.bgPurple
              //     : themeColors.lightGrayText
              // }
            />

            {/**============== Institution Filters ==================== */}
            {institutionsFilterVisible ? (
              <View className="flex flex-col mt-5 space-y-2">
                <AreaFilter filters={areaFilters} />
              </View>
            ) : null}

            {/** ========================= Render List of institutions =========================== */}
            <View
              className={`w-full bg-transparent ${
                institutionsFilterVisible ? "pt-0" : "pt-4"
              }`}
            >
              {topschools
                ? topschools.data.map((school, index) => (
                    <InstitutionItem school={school} key={index} />
                  ))
                : null}
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
