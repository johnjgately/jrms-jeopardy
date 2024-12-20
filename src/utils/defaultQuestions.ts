import { GameQuestions, Category } from '../types/game';

const createCategory = (name: string, questions: Array<{ question: string; answer: string; value: number }>): Category => ({
  id: crypto.randomUUID(),
  name,
  questions: questions.map(q => ({
    id: crypto.randomUUID(),
    category: name,
    question: q.question,
    answer: q.answer,
    value: q.value,
    isAnswered: false,
    isDouble: false,
  }))
});

export const getDefaultQuestions = (): GameQuestions => {
  const round1Categories: Category[] = [
    createCategory('Revolutionary War', [
      { question: "This general led the Continental Army to victory and became our first president", answer: "Who is George Washington?", value: 200 },
      { question: "This 1776 pamphlet by Thomas Paine inspired many to join the Revolutionary cause", answer: "What is Common Sense?", value: 400 },
      { question: "This 1775 battle near Boston featured the famous order 'Don't fire until you see the whites of their eyes'", answer: "What is the Battle of Bunker Hill?", value: 600 },
      { question: "This French Marquis became a major general in the Continental Army at age 19", answer: "Who is Marquis de Lafayette?", value: 800 },
      { question: "This 1781 battle was the last major land battle of the Revolutionary War", answer: "What is the Battle of Yorktown?", value: 1000 },
    ]),
    createCategory('Civil War', [
      { question: "This Confederate general surrendered to Ulysses S. Grant at Appomattox Court House", answer: "Who is Robert E. Lee?", value: 200 },
      { question: "This 1863 battle is often considered the turning point of the Civil War", answer: "What is the Battle of Gettysburg?", value: 400 },
      { question: "This president issued the Emancipation Proclamation on January 1, 1863", answer: "Who is Abraham Lincoln?", value: 600 },
      { question: "This Union general's 'March to the Sea' cut through Georgia", answer: "Who is William Tecumseh Sherman?", value: 800 },
      { question: "This Confederate ironclad battled the USS Monitor in 1862", answer: "What is the CSS Virginia (or Merrimack)?", value: 1000 },
    ]),
    createCategory('World War I', [
      { question: "This 1917 telegram helped bring the US into WWI", answer: "What is the Zimmermann Telegram?", value: 200 },
      { question: "This US General led the American Expeditionary Forces", answer: "Who is John J. Pershing?", value: 400 },
      { question: "These American soldiers were nicknamed 'Doughboys'", answer: "Who are WWI Infantry?", value: 600 },
      { question: "This famous WWI ace was known as the 'Red Baron'", answer: "Who is Manfred von Richthofen?", value: 800 },
      { question: "This 1918 battle was the largest American military operation in WWI", answer: "What is the Meuse-Argonne Offensive?", value: 1000 },
    ]),
    createCategory('World War II', [
      { question: "This December 7, 1941 attack brought the US into WWII", answer: "What is Pearl Harbor?", value: 200 },
      { question: "This general promised 'I shall return' to the Philippines", answer: "Who is Douglas MacArthur?", value: 400 },
      { question: "This June 6, 1944 invasion was code-named Operation Overlord", answer: "What is D-Day?", value: 600 },
      { question: "These women factory workers were represented by 'Rosie the Riveter'", answer: "Who are Women War Workers?", value: 800 },
      { question: "This secret US program developed the atomic bomb", answer: "What is the Manhattan Project?", value: 1000 },
    ]),
    createCategory('Military Tech', [
      { question: "This rifle was the standard US service weapon in WWII", answer: "What is the M1 Garand?", value: 200 },
      { question: "This WWII computer helped break the German Enigma code", answer: "What is the Bombe?", value: 400 },
      { question: "This vehicle was nicknamed the 'Jeep' in WWII", answer: "What is the Willys MB?", value: 600 },
      { question: "This aircraft dropped the atomic bombs on Japan", answer: "What is the B-29 Superfortress?", value: 800 },
      { question: "This radar technology helped Britain win the Battle of Britain", answer: "What is Chain Home?", value: 1000 },
    ]),
    createCategory('Military Leaders', [
      { question: "This WWII general was known as 'Old Blood and Guts'", answer: "Who is George S. Patton?", value: 200 },
      { question: "This admiral's flagship at Pearl Harbor was the USS Arizona", answer: "Who is Admiral Isaac Kidd?", value: 400 },
      { question: "This Civil War general became the first 4-star general in US history", answer: "Who is Ulysses S. Grant?", value: 600 },
      { question: "This WWI ace was America's most successful fighter pilot", answer: "Who is Eddie Rickenbacker?", value: 800 },
      { question: "This admiral was nicknamed 'Bull' and led the Pacific Fleet in WWII", answer: "Who is Admiral William 'Bull' Halsey?", value: 1000 },
    ]),
  ];

  const round2Categories: Category[] = [
    createCategory('Modern Warfare', [
      { question: "This 1991 operation liberated Kuwait", answer: "What is Operation Desert Storm?", value: 400 },
      { question: "This special operations force killed Osama bin Laden in 2011", answer: "Who is SEAL Team Six?", value: 800 },
      { question: "This aircraft carrier was first deployed in 1975 and is named after a WWII battle", answer: "What is the USS Nimitz?", value: 1200 },
      { question: "This stealth aircraft was first used in combat during Operation Desert Storm", answer: "What is the F-117 Nighthawk?", value: 1600 },
      { question: "This military computer network became the foundation of the internet", answer: "What is ARPANET?", value: 2000 },
    ]),
    createCategory('Military Branches', [
      { question: "This is the oldest active branch of the US military", answer: "What is the Army?", value: 400 },
      { question: "This military branch was established in 1947", answer: "What is the Air Force?", value: 800 },
      { question: "This elite military force's motto is 'Semper Fidelis'", answer: "What are the Marines?", value: 1200 },
      { question: "This branch operates the Sea, Air, and Land Teams", answer: "What is the Navy?", value: 1600 },
      { question: "This newest military branch was established in 2019", answer: "What is the Space Force?", value: 2000 },
    ]),
    createCategory('Military Operations', [
      { question: "This 1944 operation was the largest airborne operation in history", answer: "What is Operation Market Garden?", value: 400 },
      { question: "This 1983 operation invaded Grenada", answer: "What is Operation Urgent Fury?", value: 800 },
      { question: "This 1989 operation removed Manuel Noriega from power", answer: "What is Operation Just Cause?", value: 1200 },
      { question: "This 2003 operation began the Iraq War", answer: "What is Operation Iraqi Freedom?", value: 1600 },
      { question: "This operation killed ISIS leader Abu Bakr al-Baghdadi", answer: "What is Operation Kayla Mueller?", value: 2000 },
    ]),
    createCategory('Military Awards', [
      { question: "This is the highest military decoration in the United States", answer: "What is the Medal of Honor?", value: 400 },
      { question: "This purple decoration is awarded for wounds received in combat", answer: "What is the Purple Heart?", value: 800 },
      { question: "This cross was first awarded during WWI for extraordinary heroism", answer: "What is the Distinguished Service Cross?", value: 1200 },
      { question: "This medal is awarded for distinguishing oneself by heroism not involving combat", answer: "What is the Soldier's Medal?", value: 1600 },
      { question: "This star is awarded for gallantry in action against an enemy", answer: "What is the Silver Star?", value: 2000 },
    ]),
    createCategory('Military Traditions', [
      { question: "This bugle call signals the end of the day", answer: "What is Taps?", value: 400 },
      { question: "This ceremony honors fallen service members with three rifle volleys", answer: "What is the 21-gun salute?", value: 800 },
      { question: "This annual game between Army and Navy began in 1890", answer: "What is the Army-Navy Game?", value: 1200 },
      { question: "This sword is part of the Marine Corps officer uniform", answer: "What is the Mameluke Sword?", value: 1600 },
      { question: "This ceremony marks the changing of guard at the Tomb of the Unknown Soldier", answer: "What is the Changing of the Guard?", value: 2000 },
    ]),
    createCategory('Military Bases', [
      { question: "This Virginia base is the world's largest naval station", answer: "What is Naval Station Norfolk?", value: 400 },
      { question: "This Texas base is the largest military installation in the world", answer: "What is Fort Hood?", value: 800 },
      { question: "This Colorado base houses NORAD", answer: "What is Cheyenne Mountain?", value: 1200 },
      { question: "This Nevada base is known for testing experimental aircraft", answer: "What is Area 51?", value: 1600 },
      { question: "This Hawaii base was established in 1908 and is still active today", answer: "What is Pearl Harbor?", value: 2000 },
    ]),
  ];

  // Randomly set Daily Doubles based on round
  const setDailyDoubles = (categories: Category[], numDoubles: number): Category[] => {
    // Create a flat list of all question positions
    const allPositions = categories.flatMap((category, categoryIndex) =>
      category.questions.map((_, questionIndex) => ({ categoryIndex, questionIndex }))
    );

    // Define the type for position objects
    interface DoublePosition {
      categoryIndex: number;
      questionIndex: number;
    }

    // Randomly select positions for Daily Doubles
    const doublePositions: DoublePosition[] = [];
    for (let i = 0; i < numDoubles; i++) {
      const randomIndex = Math.floor(Math.random() * allPositions.length);
      doublePositions.push(allPositions.splice(randomIndex, 1)[0]);
    }

    // Apply Daily Doubles to the selected positions
    return categories.map((category, categoryIndex) => ({
      ...category,
      questions: category.questions.map((q, questionIndex) => ({
        ...q,
        isDouble: doublePositions.some(
          pos => pos.categoryIndex === categoryIndex && pos.questionIndex === questionIndex
        ),
      })),
    }));
  };

  return {
    round1: setDailyDoubles(round1Categories, 1),  // 1 Daily Double in round 1
    round2: setDailyDoubles(round2Categories, 2),  // 2 Daily Doubles in round 2
  };
}; 