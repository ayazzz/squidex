/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import {
    ApiUrlConfig,
    AssetsDto,
    AssetDto,
    AssetCreatedDto,
    AssetReplacedDto,
    AssetsService,
    DateTime,
    UpdateAssetDto,
    Version
} from './../';

describe('AssetsService', () => {
    let version = new Version('1');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                AssetsService,
                { provide: ApiUrlConfig, useValue: new ApiUrlConfig('http://service/p/') }
            ]
        });
    });

    afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
        httpMock.verify();
    }));

    it('should make get request to get assets',
        inject([AssetsService, HttpTestingController], (assetsService: AssetsService, httpMock: HttpTestingController) => {

        let assets: AssetsDto | null = null;

        assetsService.getAssets('my-app', 17, 13).subscribe(result => {
            assets = result;
        });

        const req = httpMock.expectOne('http://service/p/api/apps/my-app/assets?take=17&skip=13');

        expect(req.request.method).toEqual('GET');
        expect(req.request.headers.get('If-Match')).toBeNull();

        req.flush({
            total: 10,
            items: [
                {
                    id: 'id1',
                    created: '2016-12-12T10:10',
                    createdBy: 'Created1',
                    lastModified: '2017-12-12T10:10',
                    lastModifiedBy: 'LastModifiedBy1',
                    fileName: 'my-asset1.png',
                    fileSize: 1024,
                    fileVersion: 2000,
                    mimeType: 'text/plain',
                    isImage: true,
                    pixelWidth: 1024,
                    pixelHeight: 2048,
                    version: 11
                },
                {
                    id: 'id2',
                    created: '2016-10-12T10:10',
                    createdBy: 'Created2',
                    lastModified: '2017-10-12T10:10',
                    lastModifiedBy: 'LastModifiedBy2',
                    fileName: 'my-asset2.png',
                    fileSize: 1024,
                    fileVersion: 2000,
                    mimeType: 'text/plain',
                    isImage: true,
                    pixelWidth: 1024,
                    pixelHeight: 2048,
                    version: 22
                }
            ]
        });

        expect(assets).toEqual(
            new AssetsDto(10, [
                new AssetDto(
                    'id1', 'Created1', 'LastModifiedBy1',
                    DateTime.parseISO_UTC('2016-12-12T10:10'),
                    DateTime.parseISO_UTC('2017-12-12T10:10'),
                    'my-asset1.png',
                    1024,
                    2000,
                    'text/plain',
                    true,
                    1024,
                    2048,
                    new Version('11')),
                new AssetDto('id2', 'Created2', 'LastModifiedBy2',
                    DateTime.parseISO_UTC('2016-10-12T10:10'),
                    DateTime.parseISO_UTC('2017-10-12T10:10'),
                    'my-asset2.png',
                    1024,
                    2000,
                    'text/plain',
                    true,
                    1024,
                    2048,
                    new Version('22'))
        ]));
    }));

    it('should make get request to get asset',
        inject([AssetsService, HttpTestingController], (assetsService: AssetsService, httpMock: HttpTestingController) => {

        let assets: AssetDto | null = null;

        assetsService.getAsset('my-app', '123').subscribe(result => {
            assets = result;
        });

        const req = httpMock.expectOne('http://service/p/api/apps/my-app/assets/123');

        expect(req.request.method).toEqual('GET');
        expect(req.request.headers.get('If-Match')).toBeNull();

        req.flush({
            id: 'id1',
            created: '2016-12-12T10:10',
            createdBy: 'Created1',
            lastModified: '2017-12-12T10:10',
            lastModifiedBy: 'LastModifiedBy1',
            fileName: 'my-asset1.png',
            fileSize: 1024,
            fileVersion: 2000,
            mimeType: 'text/plain',
            isImage: true,
            pixelWidth: 1024,
            pixelHeight: 2048,
            version: 11
        });

        expect(assets).toEqual(
            new AssetDto(
                'id1', 'Created1', 'LastModifiedBy1',
                DateTime.parseISO_UTC('2016-12-12T10:10'),
                DateTime.parseISO_UTC('2017-12-12T10:10'),
                'my-asset1.png',
                1024,
                2000,
                'text/plain',
                true,
                1024,
                2048,
                new Version('11')));
    }));

    it('should append query to find by name',
        inject([AssetsService, HttpTestingController], (assetsService: AssetsService, httpMock: HttpTestingController) => {

        assetsService.getAssets('my-app', 17, 13, 'my-query').subscribe();

        const req = httpMock.expectOne('http://service/p/api/apps/my-app/assets?query=my-query&take=17&skip=13');

        expect(req.request.method).toEqual('GET');
        expect(req.request.headers.get('If-Match')).toBeNull();

        req.flush({ total: 10, items: [] });
    }));

    it('should append mime types to find by types',
        inject([AssetsService, HttpTestingController], (assetsService: AssetsService, httpMock: HttpTestingController) => {

        assetsService.getAssets('my-app', 17, 13, undefined, ['text/plain', 'image/png']).subscribe();

        const req = httpMock.expectOne('http://service/p/api/apps/my-app/assets?mimeTypes=text/plain,image/png&take=17&skip=13');

        expect(req.request.method).toEqual('GET');
        expect(req.request.headers.get('If-Match')).toBeNull();

        req.flush({ total: 10, items: [] });
    }));

    it('should append mime types to find by ids',
        inject([AssetsService, HttpTestingController], (assetsService: AssetsService, httpMock: HttpTestingController) => {

        assetsService.getAssets('my-app', 17, 13, undefined, undefined, ['12', '23']).subscribe();

        const req = httpMock.expectOne('http://service/p/api/apps/my-app/assets?ids=12,23&take=17&skip=13');

        expect(req.request.method).toEqual('GET');
        expect(req.request.headers.get('If-Match')).toBeNull();

        req.flush({ total: 10, items: [] });
    }));

    it('should make post request to create asset',
        inject([AssetsService, HttpTestingController], (assetsService: AssetsService, httpMock: HttpTestingController) => {

        let asset: AssetCreatedDto | null = null;

        assetsService.uploadFile('my-app', null!).subscribe(result => {
            asset = <AssetCreatedDto>result;
        });

        const req = httpMock.expectOne('http://service/p/api/apps/my-app/assets');

        expect(req.request.method).toEqual('POST');
        expect(req.request.headers.get('If-Match')).toBeNull();

        req.flush({
            id: 'id1',
            fileName: 'my-asset1.png',
            fileSize: 1024,
            fileVersion: 2,
            mimeType: 'text/plain',
            isImage: true,
            pixelWidth: 1024,
            pixelHeight: 2048,
            version: 11
        });

        expect(asset).toEqual(
            new AssetCreatedDto(
                'id1',
                'my-asset1.png',
                1024, 2,
                'text/plain',
                true,
                1024,
                2048,
                new Version('11')));
    }));

    it('should make put request to replace asset content',
        inject([AssetsService, HttpTestingController], (assetsService: AssetsService, httpMock: HttpTestingController) => {

        let asset: AssetReplacedDto | null = null;

        assetsService.replaceFile('my-app', '123', null!, version).subscribe(result => {
            asset = <AssetReplacedDto>result;
        });

        const req = httpMock.expectOne('http://service/p/api/apps/my-app/assets/123/content');

        expect(req.request.method).toEqual('PUT');
        expect(req.request.headers.get('If-Match')).toEqual('1');

        req.flush({
            fileSize: 1024,
            fileVersion: 2,
            mimeType: 'text/plain',
            isImage: true,
            pixelWidth: 1024,
            pixelHeight: 2048,
            version: 11
        });

        expect(asset).toEqual(
            new AssetReplacedDto(
                1024, 2,
                'text/plain',
                true,
                1024,
                2048,
                new Version('11')));
    }));

    it('should make put request to update asset',
        inject([AssetsService, HttpTestingController], (assetsService: AssetsService, httpMock: HttpTestingController) => {

        const dto = new UpdateAssetDto('My-Asset.pdf');

        assetsService.putAsset('my-app', '123', dto, version).subscribe();

        const req = httpMock.expectOne('http://service/p/api/apps/my-app/assets/123');

        expect(req.request.method).toEqual('PUT');
        expect(req.request.headers.get('If-Match')).toEqual('1');

        req.flush({});
    }));

    it('should make delete request to delete asset',
        inject([AssetsService, HttpTestingController], (assetsService: AssetsService, httpMock: HttpTestingController) => {

        assetsService.deleteAsset('my-app', '123', version).subscribe();

        const req = httpMock.expectOne('http://service/p/api/apps/my-app/assets/123');

        expect(req.request.method).toEqual('DELETE');
        expect(req.request.headers.get('If-Match')).toEqual('1');

        req.flush({});
    }));
});