import { Socket } from "../node_modules/socket.io/dist"

class User {
  public userName: string
  public teamColor: string
  public id: string
  public score: number
  public maxScore: number
  public active: boolean
  private socket: Socket;

  constructor (userName: string, teamColor: string, id: string, socket: Socket) {
    this.userName = userName
    this.teamColor = teamColor
    this.id = id
    this.score = 0
    this.maxScore = 0
    this.active = false
    this.socket = socket;
  }

  setActive (data: boolean) {
    this.active = data;
  }

  emit(event: string, data: any) {
      this.socket.emit(event, data)
  }

  setTeamColor = (teamColor: string) => {
    this.teamColor = teamColor;
  }

  toDTO = () => {
    return {
      userName: this.userName,
      id: this.id,
      teamColor: this.teamColor,
      score: this.score,
      maxScore: this.maxScore
    }
  }
}

export default User
