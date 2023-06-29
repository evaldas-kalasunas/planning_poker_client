import * as TYPES from './types'
import { socket } from './services/socket.service';

// TODO: unify & use either votes or points everywhere!!!!!!!!!!!!!!!!!!!!!
// TODO: points/votes should be initialized to null as 0 is valid vote.
function mainReducer(draft, action) {
    
    switch(action.type) {
        case TYPES.ADD_STORY: {
            const foundStory = draft.stories.find(s => s.id === action.value.id);
            if (!foundStory) {
                draft.stories.push(action.value)
            }
            break
        }
        case TYPES.SET_STORY: {
            draft.stories.push(action.value)  
            break
        }
        case TYPES.VIEW_STORY: {
            draft.selectedViewStory = action.value
            draft.showCards = false
            break
        }
        // Timer controls
        // case TYPES.INCREASE_TIMER_MINUTES: {
        //     draft.timerMinutes++
        //     break
        // }
        // case TYPES.DECREASE_TIMER_MINUTES: {
        //     draft.timerMinutes--
        //     break
        // }
        // case TYPES.INCREASE_TIMER_SECONDS: {
        //     draft.timerSeconds++
        //     break
        // }
        // case TYPES.DECREASE_TIMER_SECONDS: {
        //     draft.timerSeconds--
        //     break
        // }

        case TYPES.SET_SHOW_MODAL: {
            draft.showModal = action.value
            break
        }

        case TYPES.ADD_PLAYER: {
            const player = action.value
            draft.currentPlayer = player;
            // const hostPlayer = 
            console.log('player: ', player)
            if (player.isHost) {
                draft.roomId = player.roomId
                draft.name = player.name
                draft.isHost = player.isHost
                draft.host = {
                    name: player.name,
                    isHost: player.isHost,
                    id: player.id,
                    vote: player.vote
                }
            }
            
            // // TODO: fix for new doesn't show old 
                if (!draft.players.length) {
                    draft.players.push(player)
                } else {
                    const playerMap = draft.players.map(player => player.id)
                    if (!playerMap.includes(player.id)) {
                        draft.players.push(player)
                    }
                }
            break;
        }

        case TYPES.UPDATE_PLAYERS: {
            draft.players = action.value.players;
            if(action.value.player) {
                draft.currentPlayer = draft.currentPlayer.isHost ?  draft.currentPlayer : action.value.player;
            }
            
            break;
        }

        case TYPES.START_VOTING: {
            console.log(action)
            const storyToVote = action.value
            // draft.roomId = draft.roomId === "" ? action.value.room : draft.room
            draft.selectedViewStory = ''
            draft.showCards = storyToVote.showCards
            draft.selectedVoteStory = storyToVote.story
            draft.startVoting = storyToVote.startVoting

            // reset players votes: 
            draft.players.forEach(player => {
                player.vote = 0;
            });

            // When voting not started take from initial state, otherwise from story
            // draft.timerMinutes = storyToVote.timerMinutes || draft.timerMinutes
            // draft.timerSeconds = storyToVote.timerSeconds || draft.timerSeconds
            break;
        }
        case TYPES.STOP_VOTING: {
            draft.startVoting = action.value.startVoting;
            draft.hideVotes = !action.value.hideShowVotes;
        }
        case TYPES.RESET_VOTING: {
            draft.startVoting = action.value.startVoting
            draft.currentPlayer.vote = 0;
            draft.selectedVoteStory.points = 0;
            // todo: repeated twice
            draft.players.forEach((player) => {
                if(player.id === draft.currentPlayer.id) {
                    player.vote = 0;
                }
            })

            const { story } = action.value
            const newStory = Object.assign({}, story);

            // pick the most frequent number
            const votes = draft.players.map(player => player.vote.toString());
            const counts = {};
            let compare = 0;
            let mostFrequent;

            // finds most frequen vote
            for (let i = 0; i < votes.length; i++) {
                const vote = votes[i];
                if (!counts[vote]) {
                    counts[vote] = 1;
                }  else {
                    counts[vote] = counts[vote] + 1;
                }

                if (counts[vote] > compare) {
                    compare = counts[vote];
                    mostFrequent = votes[i];
                }
            }
            

            newStory.points = mostFrequent

            if (!draft.votedStories.includes(newStory.id)) {

                draft.votedStories.push(newStory.id)
                draft.resultsData.push(newStory)
            }
            break;
        }

        case TYPES.HIDE_SHOW_VOTES: {
            draft.hideVotes = !action.value;
            break;
        }

        case TYPES.SET_VOTES: {
            // TODO: only keep one place
            draft.currentPlayer.vote = action.value.votes;
            draft.selectedVoteStory.points = action.value.votes;
            draft.players.forEach((player) => {
                if(player.id === action.value.playerId) {
                    player.vote = action.value.votes;
                }
            })
            // const numericVotes = draft.players.filter(player => typeof player.vote === 'number' );
            // const pointsSum =  numericVotes.reduce((accumulator, object) => {
            //     return accumulator + object.vote;
            //   }, 0);
            // draft.selectedVoteStory.points = pointsSum;
            break
        }

    }
}

export default mainReducer