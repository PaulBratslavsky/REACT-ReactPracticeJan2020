class IndecisionApp extends React.Component {

    constructor(props) {
        super(props);

        this.handleDeleteOptions = this.handleDeleteOptions.bind(this);
        this.handlePick = this.handlePick.bind(this);
        this.handleAddOptionState = this.handleAddOptionState.bind(this);
        this.handleDeleteOption = this.handleDeleteOption.bind(this);

        this.state = {
            options: props.options
        };
    }

    componentDidMount() {

        const jsonData = JSON.parse(localStorage.getItem('data'));

        if ( jsonData ) {

            this.setState(() => ({ options: jsonData }));
            console.log('Component did mount', jsonData);
            
        }

        
    }

    componentDidUpdate(prevState) {

        try {
            if ( prevState.options.length !== this.state.options.length ) {

                const jsonData = JSON.stringify(this.state.options);
                localStorage.setItem('data', jsonData );
                
                console.log('save data', jsonData );
            } 
            
            if ( this.state.options.length === 0 ) {
                
                localStorage.removeItem('data');
            }
        } catch (e) {
            // Do nothing just fall back to default
            console.error('ERROR FROM LOCAL STORAGE: ', e);
        }

        

        console.log('Component did update', prevState);  
    }

    componentWillUnmount() {
        console.log('Component will unmount');
    }

    handleDeleteOptions() {
        this.setState(() => ({ options: [] }));
    }

    handleDeleteOption(option) {
        
        this.setState( prevState => {
            const newState = prevState.options.filter( item => option !== item );
            return { options: [ ... newState ] };
        });

    }

    handlePick() {
        const randomNum = Math.floor(Math.random() * this.state.options.length);
        const option = this.state.options[randomNum];
        alert(option);
    }

    handleAddOptionState(option) {

        if (!option ) {

            return 'Please fill in input';

        } else if ( this.state.options.indexOf(option) > -1 ) {

            return 'Option allready exists';

        } else {

            this.setState( prevState => ({ options: [ ...prevState.options, option ] }) );
            
            return 'Option Added';

        }
        
    }
    
    render() {
        const subtitle = 'Put your life in the hands of a computer';
        console.log('Component did render');

    return (
        <div>
            <Header subtitle={subtitle} />
            <Action
                hasOptions={this.state.options.length > 0}
                handlePick={this.handlePick}
            />
            <Options
                options={this.state.options}
                handleDeleteOptions={this.handleDeleteOptions}
                handleDeleteOption={this.handleDeleteOption}
            />
            <AddOption 
                handleAddOptionState={this.handleAddOptionState}
            />
        </div>
    );
    }
}

IndecisionApp.defaultProps = { options: [] }
    
function Header(props) {
    return (
        <div>
            <h1>{props.title}</h1>
            <h2>{props.subtitle}</h2>
        </div>
    )
}

Header.defaultProps = { title: 'Chose your destiny!'}

function Action(props) {
    return (
        <div>
            <button
                onClick={props.handlePick}
                disabled={!props.hasOptions}
            >
                What should I do?
            </button>
        </div>
    );
}

function Options(props) {

    return (
        <div>
        {props.options.length === 0 && <p>Please add an item to start</p> }
        <button onClick={props.handleDeleteOptions}>Remove All</button>
        {
            props.options.map((option) => 
                <Option 
                    key={option} 
                    optionText={option} 
                    handleDeleteOption={props.handleDeleteOption} 
                />)
        }
        </div>
    );

}

function Option(props) {

    return (
        <div>
            {props.optionText} 
                <button 
                    onClick={ (e) => {  props.handleDeleteOption(props.optionText) } }>Delete
                </button>
        </div>
    );
}

class AddOption extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = { message: undefined }
    }

    handleFormSubmit(e) {
        e.preventDefault();

        let option = e.target.elements.option.value.trim();
        
        const message = this.props.handleAddOptionState(option);

        if (message) {

            this.setState( () => ({ message }) );

            setTimeout( () => { 
                this.setState( () => ({ message: undefined }) ); 
            }, 2000)
        }

        option = e.target.elements.option.value = '';

    }

    render() {
    return (
        <div>
        <form onSubmit={this.handleFormSubmit}>
            <input type="text" name="option" />
            <button>Add Option</button>
        </form>
        { this.state.message && <p>{this.state.message}</p>}
        </div>
    );
    }
}

ReactDOM.render(<IndecisionApp />, document.getElementById('root'));
