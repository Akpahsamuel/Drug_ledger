export interface Avatar {
  id: string
  nickname: string
  avatarUrl: string
}

export const avatars: Avatar[] = [
  {
    id: "wizard",
    nickname: "Wizard",
    avatarUrl: "/avatars/wizard.svg",
  },
  {
    id: "robot",
    nickname: "Robot",
    avatarUrl: "/avatars/robot.svg",
  },
  {
    id: "astronaut",
    nickname: "Astronaut",
    avatarUrl: "/avatars/astronaut.svg",
  },
  {
    id: "traveler",
    nickname: "Traveler",
    avatarUrl: "/avatars/traveler.svg",
  },
  {
    id: "scientist",
    nickname: "Scientist",
    avatarUrl: "/avatars/scientist.svg",
  },
  {
    id: "queen",
    nickname: "Queen",
    avatarUrl: "/avatars/queen.svg",
  },
  {
    id: "samurai",
    nickname: "Samurai",
    avatarUrl: "/avatars/samurai.svg",
  },
  {
    id: "druid",
    nickname: "Druid",
    avatarUrl: "/avatars/druid.svg",
  },
  {
    id: "runner",
    nickname: "Runner",
    avatarUrl: "/avatars/runner.svg",
  },
  {
    id: "phoenix",
    nickname: "Phoenix",
    avatarUrl: "/avatars/phoenix.svg",
  },
]

export function getAvatarById(id: string): Avatar {
  return avatars.find((avatar) => avatar.id === id) || avatars[0]
}
