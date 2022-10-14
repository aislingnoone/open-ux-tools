import { AdtService } from './adt-service';
import { AdtCategory, AtoSettings } from 'abap/types';
import XmlParser from 'fast-xml-parser';

export class AtoService extends AdtService {
    private static AdtCategory = {
        scheme: 'http://www.sap.com/adt/categories/ato',
        term: 'settings'
    };

    public static getAdtCatagory(): AdtCategory {
        return AtoService.AdtCategory;
    }

    public async getAtoInfo(): Promise<AtoSettings> {
        const acceptHeaders = {
            headers: {
                Accept: 'application/*'
            }
        };
        const response = await this.get(this.serviceSchema.href, acceptHeaders);
        return this.parseAtoResponse(response.data);
    }

    /**
     * Parse an XML document for ATO (Adaptation Transport Organizer) settings.
     *
     * @param xml xml document containing ATO settings
     * @returns parsed ATO settings
     */
    private parseAtoResponse(xml: string): AtoSettings {
        if (XmlParser.validate(xml) !== true) {
            return {};
        }
        const options = {
            attributeNamePrefix: '',
            ignoreAttributes: false,
            ignoreNameSpace: true,
            parseAttributeValue: true
        };
        const obj = XmlParser.getTraversalObj(xml, options);
        const parsed = XmlParser.convertToJson(obj, options);
        return parsed.settings ? (parsed.settings as AtoSettings) : {};
    }
}
