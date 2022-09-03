import { Component } from 'react/cjs/react.production.min';
import PropTypes from 'prop-types';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        error: false,
        loading: true,
        newItemLoading: false,
        charListOffset: 210,
        charEnded: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading()
        this.marvelService.getAllCaracters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (this.charListOffset < 9) {
            ended = true
        }
        this.setState(({ charListOffset, charList }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            charListOffset: charListOffset + 9,
            charEnded: ended,
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false,
        })
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        // this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        // this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            return (
                <li
                    className="char__item"
                    key={item.id}
                    ref={this.setRef}
                    onClick={() => {this.props.onCharSelected(item.id);
                                    this.focusOnItem(i)}}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}
                    tabIndex={0}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className='char__grid'>
                {items}
            </ul>
        )
    }


    render() {

        const { charList, error, loading, charListOffset, newItemLoading, charEnded } = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{ 'display': charEnded ? 'none' : 'block' }}
                    onClick={() => this.onRequest(charListOffset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}




// CharInfo.propTypes = {
//     charId: PropTypes.string
// }

export default CharList;