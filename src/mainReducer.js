import * as TYPES from './types'

// TODO: unify & use either votes or points everywhere!!!!!!!!!!!!!!!!!!!!!
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

        case TYPES.ADD_PLAYER: {
            const player = action.value
            draft.currentPlayer = player;
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
            const storyToVote = action.value
            draft.selectedViewStory = ''
            draft.showCards = storyToVote.showCards
            draft.selectedVoteStory = storyToVote.story
            draft.startVoting = storyToVote.startVoting

            // reset players votes: 
            draft.players.forEach(player => {
                player.vote = 0;
            });
            break;
        }
        // To stop voting
        case TYPES.STOP_VOTING: {
            draft.startVoting = action.value.startVoting;
            if (!draft.votedStories.includes(action.value.votedStory.id)) {
                draft.votedStories.push(action.value.votedStory.id)
            }

            // pick the most frequent number
            const votes = draft.players.map(player => {
                console.log(JSON.stringify(player))
                return player.vote ?? player.vote.toString()});
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
              
            const resultsStory = {
                ...action.value.votedStory
            };
            resultsStory.points = mostFrequent

            const foundInResults = draft.resultsData.find(story => story.id === resultsStory.id);

            if (!foundInResults) {
                draft.resultsData.push(resultsStory)
            }
            break;
        }
        // To reset all process of story to start
        case TYPES.RESET_VOTING: {
            console.log("should not happen on stop")
            draft.showCards = false;
            draft.startVoting = action.value.startVoting
            draft.currentPlayer.vote = null;
            draft.selectedVoteStory.points = null;
            draft.selectedVoteStory = {
                text: '',
                points: undefined,
              };

            draft.players.forEach((player) => {
                if(player.id === draft.currentPlayer.id) {
                    player.vote = null;
                }
            })
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