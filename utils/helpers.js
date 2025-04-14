// function for getting time and returning a greeting based on current time
export const getLocalGreeting = () => {
  const now = new Date();
  const hours = now.getHours();

  let greeting;

  if (hours >= 5 && hours < 12) {
    greeting = "Good morning!";
  } else if (hours >= 12 && hours < 17) {
    greeting = "Good afternoon!";
  } else {
    greeting = "Good evening!";
  }

  return greeting;
};

export const getCurrentTerm = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed
  const currentDateOfMonth = currentDate.getDate(); // Day of the month
  // Check if the current month is between September and December (inclusive)
  if (currentMonth >= 9 && currentMonth <= 12) {
    return 1; // Sept-Dec (Term 1)
  }
  // Check if the current month is January or February
  else if (currentMonth >= 1 && currentMonth <= 3) {
    return 2; // Jan-Feb (Term 2)
  }
  // Check if the current month is March
  else if (currentMonth === 4) {
    // Check if the current date is on or before April 14
    if (currentDateOfMonth <= 14) {
      return 2; // Jan-Apr 14 (Term 2)
    } else {
      return 3; // Apr 15-Aug (Term 3)
    }
  }
  // Default case: April 15 to August
  else {
    return 3; // Apr 15-Aug (Term 3)
  }
};
