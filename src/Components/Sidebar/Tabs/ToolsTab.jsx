import React from 'react';
import Tool from '../../Controllers/Tool';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../../store/mapToProps/mapToProps_ToolsTab';
import { downloadFile, saveResultsToCSV, handleFilesSelect } from '../../../tools/fileManagers';
import PropTypes from 'prop-types';

class ToolsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            message: ''
        }
    }

    handleFilesSelect(e){
        const acceptableFileFormats =['.bab'];
        handleFilesSelect(this,e, 'message',true, this.props.applyLoadedStateQueryToStore,'queryLoad',acceptableFileFormats);
    }

    saveQuery() {
        let fullState = this.props.storeAllState;
        const fileContent = this.prepareStateForExport(fullState);
        if(fileContent){
            downloadFile({
                content: fileContent,
                extension: 'bab',
                filename: `baboon_query${+new Date()}.bab`
            });
        }
    }

     prepareStateForExport(object) {
        let fullState = Object.assign({},object);
        if (fullState) {
            delete fullState.config;
            delete fullState.connection;
            delete fullState.share;
            delete fullState.user;
            return JSON.stringify(fullState);
        }
    };

    saveResults(){
        saveResultsToCSV(this.props.storeQueryResults);
    }

    render() {
        return (
            <div>
                <div>
                    <h6 className='error'> {this.state.error} </h6>
                    <h6> {this.state.message} </h6>
                </div>
                <div className='featureContainer'>
                    <ul id='toolListUploadDownload'>
                        <li className='toolListItem'>
                            <Tool
                                toolType='simple'
                                buttonIcon='file-export'
                                toolId='CSVExporter'
                                description='Export results to CSV'
                                click={this.saveResults.bind(this)}
                                toolContainerID=''
                            />
                        </li>
                        <li className='toolListItem'>
                            <Tool
                                toolType='simple'
                                buttonIcon='save'
                                toolId='QuerySaver'
                                description='Save query to file'
                                click={this.saveQuery.bind(this)}
                                toolContainerID=''
                            />
                        </li>
                        <li className='toolListItem'>
                            <Tool
                                toolType='inputFile'
                                buttonIcon='file-upload'
                                toolId='QueryLoader'
                                description='Load query from file'
                                inputID='Queryfile'
                                change={this.handleFilesSelect.bind(this)}
                                uploadedFiles={this.state.uploadedFiles}
                                toolContainerID='uploadedQueryContainer'
                                classTool='uploadedFilesContainer'
                            />
                        </li>
                        <li className='toolListItem'>
                            <Tool
                                toolType='simple'
                                buttonIcon='history'
                                toolId='QueryHistory'
                                description='Browse query history (this session only)'
                                click={this.QueryHistory.bind(this)}
                                toolContainerID='queryHistoryContainer'
                            />
                        </li>
                    </ul><br />
                    <ul id='toolListMixed'>
                        <li className='toolListItem'>
                        <Tool
                            buttonIcon='toolbox'
                            toolId='EditConfig'
                            description='Edit config.json'
                            click={this.EditConfig.bind(this)}
                            toolContainerID='configJsonContainer'
                        />
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    QueryHistory() {
        console.log('QueryHistory');
    }

    EditConfig() {
        console.log('EditConfig');
    }

}

ToolsTab.propTypes={
    storeAllState: PropTypes.object,
    storeQueryResults: PropTypes.array,
    applyLoadedStateQueryToStore: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolsTab);
